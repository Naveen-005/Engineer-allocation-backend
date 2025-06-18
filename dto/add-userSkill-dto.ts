import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddUserSkillDTO {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  skill_id: number;
}
