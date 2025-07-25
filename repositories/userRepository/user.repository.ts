import { IsNull, Repository } from "typeorm";
import { User } from "../../entities/userEntities/user.entity";
import { Project } from "../../entities/projectEntities/project.entity";

class UserRepository {
  constructor(private repository: Repository<User>) {}

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findMany(): Promise<User[]> {
    return this.repository.find({
      relations: {
        role: true,
        userSkills: { skill: true },
        projectUsers: true,
        designations: { designation: true },
        notes: true,
        leadProjects: true,
        managedProjects: true,
      },
    });
  }

  async findManyEngineers(): Promise<User[]> {
    return this.repository.find({
      where: { role: { role_id: 2 } },
      relations: {
        role: true,
        userSkills: { skill: true },
        projectUsers: true,
        designations: { designation: true },
        notes: true,
        leadProjects: true,
        managedProjects: true,
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { user_id: id },
      relations: {
        role: true,
        userSkills: { skill: true },
        projectUsers: true,
        designations: { designation: true },
        notes: true,
        leadProjects: true,
        managedProjects: true,
      },
    });
  }

  async findUserId(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });
  }

  async update(id: string, user: User): Promise<void> {
    await this.repository.save({ user_id: id, ...user });
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete({ user_id: id });
  }

  // async findUserProjects(userId: string): Promise<User>{

  //   return this.repository.findOne({
  //     where: {
  //       user_id: userId
  //     },
  //     relations: {
  //       projectUsers: {
  //         where: { end_date: IsNull() }
  //       },
  //       leadProjects: {
  //         where: { enddate: IsNull() }
  //       },
  //       managedProjects: {
  //         where: { enddate: IsNull() }
  //       }
  //     }

  //   });

  // }
  async findUserProjects(userId: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { user_id: userId },
      relations: ["projectUsers", "leadProjects", "managedProjects"],
    });

    if (user) {
      // Filter out projects with non-null end dates
      user.projectUsers =
        user.projectUsers?.filter((p) => p.end_date === null) || [];
      user.leadProjects =
        user.leadProjects?.filter((p) => p.enddate === null) || [];
      user.managedProjects =
        user.managedProjects?.filter((p) => p.enddate === null) || [];
    }

    return user;
  }

  async findAvailableEngineers(filters: {
    designation?: string | null;
    skill?: string | null;
  }) {
    const query = this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userSkills", "userSkill")
      .leftJoinAndSelect("userSkill.skill", "skillAlias")
      .leftJoinAndSelect("user.designations", "userDesignation")
      .leftJoinAndSelect("userDesignation.designation", "designationAlias")
      .leftJoin("user.projectUsers", "pu")
      .where("user.role = :role", { role: 2 }) // ENGINEER
      .andWhere("user.deleted_at IS NULL")
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("pu_sub.user_id")
          .from("project_user", "pu_sub")
          .groupBy("pu_sub.user_id")
          .having("COUNT(pu_sub.project_id) >= 2")
          .getQuery();
        return `user.id NOT IN ${subQuery}`;
      });

    if (filters.designation) {
      query.andWhere("designationAlias.name ILIKE :designation", {
        designation: `%${filters.designation}%`,
      });
    }

    if (filters.skill) {
      query.andWhere("skillAlias.skill_name ILIKE :skill", {
        skill: `%${filters.skill}%`,
      });
    }

    return await query.getMany();
  }
  
  async findAssignableEngineers(filters: { skill?: number[] | null }) {
    let query = this.repository
      .createQueryBuilder("user")
      .leftJoin("user.projectUsers", "pu")
      .where("user.role = :role", { role: 2 }) // ENGINEER
      .andWhere("user.deleted_at IS NULL")
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("pu_sub.user_id")
          .from("project_user", "pu_sub")
          .groupBy("pu_sub.user_id")
          .having("COUNT(pu_sub.project_id) >= 2")
          .getQuery();
        return `user.id NOT IN ${subQuery}`;
      });

    if (filters.skill && filters.skill.length > 0) {
      query = query
        .innerJoin("user.userSkills", "userSkill")
        .innerJoin("userSkill.skill", "skillAlias")
        .andWhere("skillAlias.id IN (:...skillIds)", {
          skillIds: filters.skill,
        })
        .groupBy("user.id")
        .having("COUNT(DISTINCT skillAlias.id) = :skillCount", {
          skillCount: filters.skill.length,
        });
    }

    return await query.getMany();
  }

    // Engineers with fewer than 1 active project
  async getUnderutilizedEngineers(): Promise<User[]> {
    const query = this.repository
      .createQueryBuilder("user")
      .leftJoin("user.projectUsers", "pu")
      .where("user.role = :role", { role: 2 })
      .andWhere("user.deleted_at IS NULL")
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("pu_sub.user_id")
          .from("project_user", "pu_sub")
          .groupBy("pu_sub.user_id")
          .having("COUNT(pu_sub.project_id) >= 1")
          .getQuery();
        return `user.id NOT IN ${subQuery}`;
      });

    return await query.getMany();
  }

  // Engineers who have been on the same project > 180 days
  async getRotationNeededEngineers(): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("user")
      .innerJoin("user.projectUsers", "pu")
      .where("user.role = :role", { role: 2 })
      .andWhere("user.deleted_at IS NULL")
      .andWhere("pu.assigned_on <= :threshold", {
        threshold: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
      })
      .andWhere("pu.end_date IS NULL")
      .getMany();
  }

  // Engineers with < 2 years experience (for potential upskilling)
  async getUpskillingCandidates(): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("user")
      .where("user.role = :role", { role: 2 })
      .andWhere("user.deleted_at IS NULL")
      .andWhere("user.experience < :exp", { exp: 2 })
      .getMany();
  }

}

export default UserRepository;
