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
      relations: ['projectUsers', 'leadProjects', 'managedProjects']
    });

    if (user) {
      // Filter out projects with non-null end dates
      user.projectUsers = user.projectUsers?.filter(p => p.end_date === null) || [];
      user.leadProjects = user.leadProjects?.filter(p => p.enddate === null) || [];
      user.managedProjects = user.managedProjects?.filter(p => p.enddate === null) || [];
    }

    return user;
  }
}

export default UserRepository;
