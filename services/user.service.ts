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
import { LoggerService } from '../services/logger.service';

class UserService {
  private logger = LoggerService.getInstance(UserService.name);

  constructor(private userRepository: UserRepository) {}

  private roleRepository = datasource.getRepository(Role);
  private skillRepository = datasource.getRepository(Skill);
  private userSkillRepository = datasource.getRepository(UserSkill);
  private designationRepository = datasource.getRepository(Designation);
  private userDesignationRepository = datasource.getRepository(UserDesignation);

  async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.info(`Creating user with email: ${dto.email}`);

    const user = new User();
    user.user_id = dto.user_id;
    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.joined_at = dto.joined_at ? new Date(dto.joined_at) : null;
    user.experience = dto.experience ?? null;

    const role = await this.roleRepository.findOneBy({ role_id: dto.role_id });
    if (!role) {
      this.logger.error(`Role with ID ${dto.role_id} not found`);
      throw new Error(`Role with ID ${dto.role_id} not found`);
    }
    user.role = role;

    // Save user first to get the generated ID
    const savedUser = await this.userRepository.create(user);
    this.logger.info(`User ${savedUser.user_id} created successfully`);

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
    this.logger.info('Fetching all users');
    const users = await this.userRepository.findMany();
    this.logger.info(`Fetched ${users.length} users`);
    return users;
  }

  async getAllEngineers(): Promise<User[]> {
    this.logger.info('Fetching all engineers');
    const engineers = await this.userRepository.findManyEngineers();
    this.logger.info(`Fetched ${engineers.length} engineers`);
    return engineers;
  }

  async getUserById(id: string): Promise<User> {
    this.logger.info(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new Error("User not found");
    }
    this.logger.info(`User ${id} fetched successfully`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    this.logger.info(`Fetching user with email: ${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      this.logger.info(`User with email ${email} found`);
    } else {
      this.logger.info(`User with email ${email} not found`);
    }
    return user;
  }

  async getAvailableUsers(): Promise<User[]> {
    this.logger.info('Fetching available users');
    const users = await this.userRepository.findMany();
    const availableUsers = users.filter(
      (user) =>
        user.projectUsers.length +
          user.leadProjects.length +
          user.managedProjects.length <
        2
    );
    this.logger.info(`Found ${availableUsers.length} available users out of ${users.length} total users`);
    return availableUsers;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    this.logger.info(`Updating user with ID: ${id}`);

    const user = await this.userRepository.findOneById(id);
    if (!user) {
      this.logger.error(`User with ID ${id} not found for update`);
      throw new Error("User not found");
    }

    user.name = dto.name;
    user.email = dto.email;
    user.joined_at = dto.joined_at ? new Date(dto.joined_at) : user.joined_at;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
      this.logger.info(`Password updated for user ${id}`);
    }

    const role = await this.roleRepository.findOneBy({ role_id: dto.role_id });
    if (!role) {
      this.logger.error(`Role with ID ${dto.role_id} not found`);
      throw new Error(`Role with ID ${dto.role_id} not found`);
    }
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

    this.logger.info(`User ${id} updated successfully`);
    // fresh fetch with updated relations
    return this.userRepository.findOneById(id);
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.info(`Deleting user with ID: ${id}`);
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      this.logger.error(`User with ID ${id} not found for deletion`);
      throw new Error("User not found");
    }
    await this.userRepository.delete(id);
    this.logger.info(`User ${id} deleted successfully`);
  }

  private async handleUserDesignation(
    user: User,
    designationId: number
  ): Promise<void> {
    this.logger.info(`Handling designation ${designationId} for user ${user.user_id}`);

    // Delete existing user designations
    await this.userDesignationRepository.delete({
      user: { id: user.id }, // Use the primary key ID
    });

    const designation = await this.designationRepository.findOneBy({
      id: designationId,
    });
    if (!designation) {
      this.logger.error(`Designation with ID ${designationId} not found`);
      throw new Error(`Designation with ID ${designationId} not found`);
    }

    const userDesignation = new UserDesignation();
    userDesignation.user = user; // This now has the proper ID
    userDesignation.designation = designation;

    await this.userDesignationRepository.save(userDesignation);
    this.logger.info(`Designation ${designationId} assigned to user ${user.user_id}`);
  }

  private async handleUserSkills(
    user: User,
    skillIds: number[]
  ): Promise<void> {
    this.logger.info(`Handling skills [${skillIds.join(', ')}] for user ${user.user_id}`);

    // Delete existing user skills if any
    await this.userSkillRepository.delete({ user: { id: user.id } });

    const skills = await this.skillRepository.find({
      where: { skill_id: In(skillIds) },
    });

    if (skills.length !== skillIds.length) {
      const foundIds = skills.map((s) => s.skill_id);
      const missingIds = skillIds.filter((id) => !foundIds.includes(id));
      this.logger.error(`Skills not found: ${missingIds.join(", ")}`);
      throw new Error(`Skills not found: ${missingIds.join(", ")}`);
    }

    const userSkills = skills.map((skill) => {
      const us = new UserSkill();
      us.user = user; // This now has the proper ID
      us.skill = skill;
      return us;
    });

    await this.userSkillRepository.save(userSkills);
    this.logger.info(`${skillIds.length} skills assigned to user ${user.user_id}`);
  }

  async appendSkillsToUser(userId: string, skillIds: number[]): Promise<User> {
    this.logger.info(`Appending skills [${skillIds.join(', ')}] to user ${userId}`);

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found for skill append`);
      throw new Error("User not found");
    }

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
      this.logger.info(`${newSkillIds.length} new skills appended to user ${userId}`);
    } else {
      this.logger.info(`No new skills to append for user ${userId}`);
    }

    return this.userRepository.findOneById(userId); // return updated user
  }

  async updateUserExperience(
    userId: string,
    experience: number
  ): Promise<User> {
    this.logger.info(`Updating experience to ${experience} for user ${userId}`);

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found for experience update`);
      throw new Error("User not found");
    }

    user.experience = experience;
    await this.userRepository.update(userId, user);
    this.logger.info(`Experience updated for user ${userId}`);

    return this.userRepository.findOneById(userId); // return updated user
  }

  async getUserListByIds(ids: string[]) {
    this.logger.info(`Fetching users with IDs: [${ids.join(', ')}]`);

    const userPromises = ids.map(async (id) => {
      const user = await this.userRepository.findOneById(id);
      if (!user) {
        this.logger.error(`User with ID ${id} not found`);
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    });

    const users = await Promise.all(userPromises);
    this.logger.info(`Fetched ${users.length} users successfully`);
    return users;
  }

  async getUserProjects(id: string) {
    this.logger.info(`Fetching projects for user ${id}`);
    const projects = await this.userRepository.findUserProjects(id);
    this.logger.info(`Found projects for user ${id}`);
    return projects;
  }
}

export default UserService;