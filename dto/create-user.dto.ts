import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  ArrayNotEmpty,
  IsArray,
  IsInt,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsDateString()
  joined_at?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @IsInt()
  role_id: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  skill_ids?: number[];

  @IsOptional()
  @IsInt()
  designation_id?: number;
}
