import DesignationRepository from "../repositories/designationRepository/designation.repository";
import { Designation } from "../entities/userEntities/designation.entity";
import { LoggerService } from '../services/logger.service';

export class DesignationService {
  private logger = LoggerService.getInstance(DesignationService.name);

  constructor(private designationRepository: DesignationRepository) {}

  async getDesignationById(id: number): Promise<Designation> {
    this.logger.info(`Fetching designation with id ${id}`);
    
    const designation = await this.designationRepository.getById(id);
    
    if (designation) {
      this.logger.info(`Successfully fetched designation ${id}`);
    } else {
      this.logger.warn(`Designation ${id} not found`);
    }
    
    return designation;
  }

  async listDesignations(): Promise<Designation[]> {
    this.logger.info('Fetching all designations');
    
    const designations = await this.designationRepository.list();
    
    this.logger.info(`Fetched ${designations.length} designations`);
    return designations;
  }
}