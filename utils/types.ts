// Base interface for entities extending AbstractEntity
interface AbstractEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// User related interfaces
export interface User extends AbstractEntity {
  user_id: string;
  name: string;
  email: string;
  password: string;
  joined_at?: Date;
  experience?: number;
  role: Role;
  userSkills?: UserSkill[];
  managedProjects?: Project[];
  leadProjects?: Project[];
  projectUsers?: ProjectUser[];
  notes?: Note[];
  designations?: UserDesignation[];
}

export interface UserDesignation extends AbstractEntity {
  user: User;
  designation: Designation;
}

export interface UserSkill extends AbstractEntity {
  user: User;
  skill: Skill;
}

// Designation interface
export interface Designation extends AbstractEntity {
  name: string;
  userDesignations?: UserDesignation[];
  requirements?: ProjectEngineerRequirement[];
  projectAssignments?: ProjectUser[];
}

// Role interface
export interface Role extends AbstractEntity {
  role_id: number;
  role_name: string;
  users?: User[];
}

// Skill interface
export interface Skill extends AbstractEntity {
  skill_id: number;
  skill_name: string;
  userSkills?: UserSkill[];
  requirementSkills?: ProjectEngineerRequirementSkill[];
}

// Project related interfaces
export interface Project extends AbstractEntity {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pm: User;
  lead: User;
  projectUsers?: ProjectUser[];
  notes?: Note[];
  requirements?: ProjectEngineerRequirement[];
}

export interface ProjectUser extends AbstractEntity {
  project: Project;
  user: User;
  is_shadow: boolean;
  assigned_on?: Date;
  end_date?: Date;
  designation: Designation;
  designation_id?: number;
}

export interface ProjectEngineerRequirement extends AbstractEntity {
  project: Project;
  designation: Designation;
  required_count: number;
  is_requested: boolean;
  requirementSkills?: ProjectEngineerRequirementSkill[];
}

export interface ProjectEngineerRequirementSkill extends AbstractEntity {
  requirement: ProjectEngineerRequirement;
  skill: Skill;
}

// Note interface
export interface Note extends AbstractEntity {
  project: Project;
  author: User;
  content: string;
}

// Utility interfaces for API responses (without sensitive data)
export interface UserPublic extends Omit<User, 'password'> {}

export interface UserBasic {
  id: number;
  user_id: string;
  name: string;
  email: string;
  experience?: number;
  role: Role;
}

export interface ProjectBasic {
  id: number;
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pm: UserBasic;
  lead: UserBasic;
}