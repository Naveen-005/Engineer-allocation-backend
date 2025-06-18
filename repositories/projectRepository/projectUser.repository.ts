import {  Repository } from "typeorm";
import { ProjectUser } from "../../entities/projectEntities/projectUser.entity";
import { IsNull } from "typeorm";

class ProjectUserRepository {
  constructor(private repository: Repository<ProjectUser>) {}


    async findUserAssignmentByProjectIdAndUserId(userId,projectId){
      return this.repository.findOne({
        where: {
          user: { user_id: userId }, 
          project: { id: projectId },
          end_date: IsNull()
        },
        relations: {
          user: true,
          project: true
        }
      })
    }


    async update(projectUserAssignment) {

      await this.repository.save(projectUserAssignment);

    }

}

export default ProjectUserRepository;
