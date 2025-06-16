import bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import datasource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import { Role } from "../entities/role.entity";
import { Skill } from "../entities/skill.entity";
import { UserSkill } from "../entities/userEntities/userSkill.entity";

import { UserDesignation } from "../entities/userEntities/userDesignation.entity";
import UserRepository from "../repositories/userRepository/user.repository";
import { In } from "typeorm";
import { Designation } from "../entities/userEntities/designation.entity";


class UserService {
  constructor(private userRepository: UserRepository) {}

  private roleRepository = datasource.getRepository(Role);
  private skillRepository = datasource.getRepository(Skill);
  private userSkillRepository = datasource.getRepository(UserSkill);
  private designationRepository = datasource.getRepository(Designation);
  private userDesignationRepository = datasource.getRepository(UserDesignation);

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.user_id = dto.user_id;
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

    // Save user first to get the generated ID
    const savedUser = await this.userRepository.create(user);

    // Now handle relationships using the saved user with ID
    if (dto.skill_ids && dto.skill_ids.length > 0) {
      await this.handleUserSkills(savedUser, dto.skill_ids);
    }

    if (dto.designation_id) {
      await this.handleUserDesignation(savedUser, dto.designation_id);
    }

    return this.userRepository.findOneById(savedUser.user_id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getAvailableUsers() : Promise<User[]>{
    const users = await this.userRepository.findMany();
    return users.filter(user => ((user.projectUsers.length+ user.leadProjects.length + user.managedProjects.length )<2));
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new Error("User not found");

    user.name = dto.name;
    user.email = dto.email;
    user.joined_at = dto.joined_at ? new Date(dto.joined_at) : user.joined_at;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const role = await this.roleRepository.findOneBy({ role_id: dto.role_id });
    if (!role) throw new Error(`Role with ID ${dto.role_id} not found`);
    user.role = role;

    await this.userRepository.update(id, user);

    // Append new skills without removing existing ones
    
    if (dto.skill_ids && dto.skill_ids.length > 0) {
      await this.handleUserSkills(user, dto.skill_ids);
    }

    // Update experience (if provided)
    if (dto.experience !== undefined) {
      await this.updateUserExperience(id, dto.experience);
    }

    // Update designation (if provided)
    if (dto.designation_id) {
      await this.handleUserDesignation(user, dto.designation_id);
    }

    // fresh fetch with updated relations
    return this.userRepository.findOneById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new Error("User not found");
    await this.userRepository.delete(id);
  }

  private async handleUserDesignation(
    user: User,
    designationId: number
  ): Promise<void> {
    // Delete existing user designations
    await this.userDesignationRepository.delete({
      user: { id: user.id }, // Use the primary key ID
    });

    const designation = await this.designationRepository.findOneBy({
      id: designationId,
    });
    if (!designation) {
      throw new Error(`Designation with ID ${designationId} not found`);
    }

    const userDesignation = new UserDesignation();
    userDesignation.user = user; // This now has the proper ID
    userDesignation.designation = designation;

    await this.userDesignationRepository.save(userDesignation);
  }

  private async handleUserSkills(
    user: User,
    skillIds: number[]
  ): Promise<void> {
    // Delete existing user skills if any
    await this.userSkillRepository.delete({ user: { id: user.id } });

    const skills = await this.skillRepository.find({
      where: { skill_id: In(skillIds) },
    });

    if (skills.length !== skillIds.length) {
      const foundIds = skills.map((s) => s.skill_id);
      const missingIds = skillIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Skills not found: ${missingIds.join(", ")}`);
    }

    const userSkills = skills.map((skill) => {
      const us = new UserSkill();
      us.user = user; // This now has the proper ID
      us.skill = skill;
      return us;
    });

    await this.userSkillRepository.save(userSkills);
  }

  async appendSkillsToUser(userId: string, skillIds: number[]): Promise<User> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new Error("User not found");

    const existingSkillIds = user.userSkills.map((us) => us.skill.skill_id);
    const newSkillIds = skillIds.filter((id) => !existingSkillIds.includes(id));

    if (newSkillIds.length > 0) {
      const skills = await this.skillRepository.findBy({
        skill_id: In(newSkillIds),
      });

      const newUserSkills = skills.map((skill) => {
        const us = new UserSkill();
        us.user = user;
        us.skill = skill;
        return us;
      });

      await this.userSkillRepository.save(newUserSkills);
    }

    return this.userRepository.findOneById(userId); // return updated user
  }

  async updateUserExperience(
    userId: string,
    experience: number
  ): Promise<User> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new Error("User not found");

    user.experience = experience;
    await this.userRepository.update(userId, user);

    return this.userRepository.findOneById(userId); // return updated user
  }
}

export default UserService;
