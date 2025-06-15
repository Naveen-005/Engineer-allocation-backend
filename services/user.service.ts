import bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import datasource from "../db/data-source";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Skill } from "../entities/skill.entity";
import { UserSkill } from "../entities/userSkill.entity";
import { Designation } from "../entities/designation.entity";
import { UserDesignation } from "../entities/userDesignation.entity";
import UserRepository from "../repositories/user.repository";
import { In } from "typeorm";



class UserService {
  constructor(private userRepository: UserRepository) {}

  private roleRepository = datasource.getRepository(Role);
  private skillRepository = datasource.getRepository(Skill);
  private userSkillRepository = datasource.getRepository(UserSkill);
  private designationRepository = datasource.getRepository(Designation);
  private userDesignationRepository = datasource.getRepository(UserDesignation);

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.joined_at = dto.joined_at ? new Date(dto.joined_at) : null;
    user.experience = dto.experience ?? null;

    const role = await this.roleRepository.findOneBy({ role_id: dto.role_id });
    if (!role) {
      throw new Error(`Role with ID ${dto.role_id} not found`);
    }
    user.role = role;

    const savedUser = await this.userRepository.create(user);

    if (dto.skill_ids && dto.skill_ids.length > 0) {
      await this.handleUserSkills(user, dto.skill_ids);
    }

    if (dto.designation_id) {
      await this.handleUserDesignation(user, dto.designation_id);
    }

    return savedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new Error("User not found");

    user.name = dto.name;
    user.email = dto.email;
    user.joined_at = dto.joined_at ? new Date(dto.joined_at) : user.joined_at;
    user.experience = dto.experience ?? user.experience;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const roleRepo = datasource.getRepository(Role);
    const role = await roleRepo.findOneBy({ role_id: dto.role_id });
    if (!role) throw new Error(`Role with ID ${dto.role_id} not found`);
    user.role = role;

    await this.userRepository.update(id, user);

    const userSkillRepo = datasource.getRepository(UserSkill);
    const skillRepo = datasource.getRepository(Skill);
    const userDesignationRepo = datasource.getRepository(UserDesignation);
    const designationRepo = datasource.getRepository(Designation);

    if (dto.skill_ids && dto.skill_ids.length > 0) {
      await this.handleUserSkills(user, dto.skill_ids);
    }

    if (dto.designation_id) {
      await this.handleUserDesignation(user, dto.designation_id);
    }

    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new Error("User not found");
    await this.userRepository.delete(id);
  }

  private async handleUserDesignation(
    user: User,
    designationId: number
  ): Promise<void> {
    await this.userDesignationRepository.delete({
      user: { user_id: user.user_id },
    });

    const designation = await this.designationRepository.findOneBy({
      id: designationId,
    });
    if (!designation)
      throw new Error(`Designation with ID ${designationId} not found`);

    const userDesignation = new UserDesignation();
    userDesignation.user = user;
    userDesignation.designation = designation;

    await this.userDesignationRepository.save(userDesignation);
  }

  private async handleUserSkills(
    user: User,
    skillIds: number[]
  ): Promise<void> {
    await this.userSkillRepository.delete({ user: { user_id: user.user_id } });

    const skills = await this.skillRepository.find({
      where: { skill_id: In(skillIds) },
    });

    const userSkills = skills.map((skill) => {
      const us = new UserSkill();
      us.user = user;
      us.skill = skill;
      return us;
    });

    await this.userSkillRepository.save(userSkills);
  }
}

export default UserService;
