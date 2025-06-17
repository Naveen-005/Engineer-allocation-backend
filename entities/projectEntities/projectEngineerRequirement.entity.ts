import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Designation } from "../userEntities/designation.entity";
import { Project } from "./project.entity";
import { ProjectEngineerRequirementSkill } from "./projectEngineerRequirementSkill.entity";
import AbstractEntity from "../abstract.entity";

@Entity("project_engineer_requirements")
export class ProjectEngineerRequirement extends AbstractEntity {
  constructor(
    project?: Project,
    designation?: Designation,
    required_count?: number,
    is_requested?: boolean,
    requirementSkills?: ProjectEngineerRequirementSkill[]
  ) {
    super();
    if (project) this.project = project;
    if (designation) this.designation = designation;
    if (required_count !== undefined) this.required_count = required_count;
    if (is_requested !== undefined) this.is_requested = is_requested;
    if (requirementSkills) this.requirementSkills = requirementSkills;
  }

  @ManyToOne(() => Project, (p) => p.requirements)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @ManyToOne(() => Designation, (d) => d.requirements)
  @JoinColumn({ name: "designation_id" })
  designation: Designation;

  @Column()
  required_count: number;

  @Column({ default: false })
  is_requested: boolean;

  @OneToMany(() => ProjectEngineerRequirementSkill, (rs) => rs.requirement)
  requirementSkills: ProjectEngineerRequirementSkill[];
}
