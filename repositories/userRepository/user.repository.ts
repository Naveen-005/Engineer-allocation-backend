import { Repository } from "typeorm";
import { User } from "../../entities/userEntities/user.entity";

class UserRepository {
  constructor(private repository: Repository<User>) {}

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findMany(): Promise<User[]> {
    return this.repository.find({
      relations: {
        role: true,
        userSkills: {
          skill: true,
        },
        projectUsers: {
          project: true,
        },
        designations: {
          designation: true,
        },
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
        userSkills: {
          skill: true,
        },
        projectUsers: {
          project: true,
        },
        designations: {
          designation: true,
        },
        notes: true,
        leadProjects: true,
        managedProjects: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async update(id: string, user: User): Promise<void> {
    await this.repository.save({ user_id: id, ...user });
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}

export default UserRepository;
