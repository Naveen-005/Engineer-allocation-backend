import { IsArray, IsBoolean, IsInt, ValidateNested } from "class-validator";
import { Skill } from "../../entities/skill.entity";

class CreateRequirementDto {
  @IsInt()
  project_id: number;

  @IsInt()
  required_count: number;

  @IsInt()
  designation_id: number;

  @IsBoolean()
  is_requested: boolean;

  @IsArray()
  requirement_skills: Skill[]; 

}

export default CreateRequirementDto