// src/services/report.service.ts
import PDFDocument from "pdfkit";
import fs from "fs";
import { OpenAI } from "openai";
import path from "path";
import dataSource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import UserRepository from "../repositories/userRepository/user.repository";
import { LoggerService } from "./logger.service";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export class ReportService {
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private logger = LoggerService.getInstance(ReportService.name);

  async generateInsightsAndPDF(): Promise<Buffer> {
    this.logger.info('Starting PDF report generation with insights');

    try {
      // STEP 1: Fetch categorized data
      this.logger.info('Fetching categorized engineer data');
      const [underutilized, rotationNeeds, upskilling] = await Promise.all([
        this.userRepo.getUnderutilizedEngineers(),
        this.userRepo.getRotationNeededEngineers(),
        this.userRepo.getUpskillingCandidates(),
      ]);

      this.logger.info(`Data fetched - Underutilized: ${underutilized.length}, Rotation: ${rotationNeeds.length}, Upskilling: ${upskilling.length}`);

      // STEP 2: Generate narrative using OpenAI
      this.logger.info('Generating AI narrative for report');
      const summaryText = await this.generateNarrative({ underutilized, rotationNeeds, upskilling });

      // STEP 3: Generate and return PDF buffer
      this.logger.info('Creating PDF document');
      const pdfBuffer = await this.createPDF(summaryText);
      
      this.logger.info(`PDF report generated successfully - Size: ${pdfBuffer.length} bytes`);
      return pdfBuffer;
    } catch (error) {
      this.logger.error(`Failed to generate PDF report: ${error}`);
      throw error;
    }
  }

  private async generateNarrative(data: any): Promise<string> {
    this.logger.info('Starting AI narrative generation');

    const systemPrompt = `
You are an HR assistant generating a professional report on engineer utilization, project rotation, and upskilling.

For each section:
1. Briefly describe what the insight means.
2. Summarize the key observations.
3. Optionally recommend actions or follow-up.

Keep it formal, clear, and concise.
`;

    const userPrompt = `
Here is the raw data:
${JSON.stringify(data, null, 2)}

Please generate three distinct narrative sections:
- Underutilization Insights
- Rotation Needs
- Upskilling Opportunities

Return it as plain text. Each section should be clearly titled.
`;

    try {
      this.logger.info('Calling OpenAI API for narrative generation');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      });

      const narrativeContent = completion.choices[0].message.content || "Unable to generate report.";
      this.logger.info(`AI narrative generated successfully - Length: ${narrativeContent.length} characters`);
      
      return narrativeContent;
    } catch (error) {
      this.logger.error(`Failed to generate AI narrative: ${error}`);
      return "Unable to generate report due to AI service error.";
    }
  }

  private async createPDF(summary: string): Promise<Buffer> {
    this.logger.info('Starting PDF document creation');

    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {});

      // Title
      this.logger.info('Adding title to PDF');
      doc.fontSize(20).font("Helvetica-Bold").text("Engineer Insights Report", { align: "center" });
      doc.moveDown(2);

      // SECTION 1: Engineer Summary Table
      this.logger.info('Creating engineer summary table');
      doc.fontSize(14).font("Helvetica-Bold").text("Engineer Summary Table");
      doc.moveDown(0.5);

      const addTableRow = (
        y: number,
        col1: string,
        col2: string,
        col3: string,
        bold = false
      ) => {
        const font = bold ? "Helvetica-Bold" : "Helvetica";
        doc.font(font).fontSize(10);
        doc.text(col1, 50, y, { width: 200 });
        doc.text(col2, 250, y, { width: 100 });
        doc.text(col3, 350, y, { width: 150 });
      };

      // Header row
      let y = doc.y;
      addTableRow(y, "Engineer Name", "Experience", "Status", true);
      y += 20;

      this.logger.info('Fetching engineer data for table population');
      const engineers = [
        ...(await this.userRepo.getUnderutilizedEngineers()).map((e) => ({
          name: e.name,
          experience: e.experience,
          status: "Underutilized",
        })),
        ...(await this.userRepo.getRotationNeededEngineers()).map((e) => ({
          name: e.name,
          experience: e.experience,
          status: "Rotation",
        })),
        ...(await this.userRepo.getUpskillingCandidates()).map((e) => ({
          name: e.name,
          experience: e.experience,
          status: "Upskilling",
        })),
      ];

      // Remove duplicates
      const uniqueRows = new Map();
      for (const row of engineers) {
        const key = `${row.name}-${row.status}`;
        if (!uniqueRows.has(key)) uniqueRows.set(key, row);
      }

      this.logger.info(`Populating table with ${uniqueRows.size} unique engineer entries`);

      for (const row of uniqueRows.values()) {
        addTableRow(y, row.name, `${row.experience} yrs`, row.status);
        y += 18;
        if (y > doc.page.height - 100) {
          doc.addPage();
          y = 50;
        }
      }

      doc.moveDown(2);

      // SECTION 2: AI Narrative
      this.logger.info('Adding AI-generated narrative sections to PDF');
      const sections = summary
        .replace(/\*\*(.*?)\*\*/g, "$1") // remove **bold** syntax
        .split(/(?=Underutilization Insights|Rotation Needs|Upskilling Opportunities)/g);

      this.logger.info(`Processing ${sections.length} narrative sections`);

      for (const section of sections) {
        const [titleLine, ...paragraphs] = section.trim().split("\n");

        const title = titleLine.trim();
        const body = paragraphs.join("\n").trim();

        if (title && body) {
          this.logger.info(`Adding section: ${title}`);
          doc.addPage(); // start each insight section on a new page
          doc.fontSize(14).font("Helvetica-Bold").text(title, { align: "left" });
          doc.moveDown(1);

          doc.fontSize(11).font("Helvetica").text(body, {
            align: "justify",
            lineGap: 6,
          });

          doc.moveDown(2);
        }
      }

      this.logger.info('Finalizing PDF document');
      doc.end();

      return new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => {
          const buffer = Buffer.concat(chunks);
          this.logger.info(`PDF creation completed - Final size: ${buffer.length} bytes`);
          resolve(buffer);
        });
        doc.on("error", (error) => {
          this.logger.error(`PDF generation failed: ${error}`);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error(`Error during PDF creation: ${error}`);
      throw error;
    }
  }
}