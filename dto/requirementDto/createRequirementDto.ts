import { IsBoolean, IsInt } from "class-validator";

class CreateRequirementDto {
  @IsInt()
  project_id: number;

  @IsInt()
  required_count: number;

  @IsInt()
  designation_id: number;

  @IsBoolean()
  is_requested: boolean;
}

export default CreateRequirementDto