import DesignationRepository from "../repositories/designationRepository/designation.repository";
import { Designation } from "../entities/userEntities/designation.entity";

export class DesignationService {
  constructor(private designationRepository: DesignationRepository) {}

  async getDesignationById(id: number): Promise<Designation> {
    return await this.designationRepository.getById(id);
  }

  async listDesignations(): Promise<Designation[]> {
    return await this.designationRepository.list();
  }
}