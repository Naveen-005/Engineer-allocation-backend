// src/controllers/report.controller.ts
import { Request, Response, Router, NextFunction } from "express";
import { ReportService } from "../services/aiReport.services";
import { LoggerService } from "../services/logger.service";

class ReportController {
  constructor(private reportService: ReportService, router: Router) {
    router.get("/download", this.downloadReport.bind(this));
  }

  async downloadReport(req: Request, res: Response, next: NextFunction) {
    const logger = LoggerService.getInstance("ReportController");
    try {
      const pdfBuffer = await this.reportService.generateInsightsAndPDF();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=engineer_insights_report.pdf");
      res.send(pdfBuffer);
    } catch (err) {
      logger.error(`Failed to generate report: ${err}`);
      next(err);
    }
  }
}

export default ReportController;
