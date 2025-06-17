import {  Repository } from "typeorm";
import { ProjectUser } from "../../entities/projectEntities/projectUser.entity";
import { IsNull } from "typeorm";

class ProjectRepository {
  constructor(private repository: Repository<ProjectUser>) {}

    // async findUserProjects(userId: string): Promise<[ProjectUser[], number]> {
    //     return this.repository.findAndCount({
    //         where: { 
    //             user.user_id: userId,
    //             deleted_at: IsNull(),
    //             end_date: IsNull()
    //         },relations: {

    //             user: true,
    //         }
    //     });
    // }

}
