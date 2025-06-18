import {  Repository } from "typeorm";
import { Designation } from "../../entities/userEntities/designation.entity";

class DesignationRepository {
  constructor(private repository: Repository<Designation>) {}

  async getById(id: number): Promise<Designation> {
    return this.repository.findOneBy({ id });
  }

  async list(): Promise<Designation[]> {
    return this.repository.find();
  }
}

export default DesignationRepository;
