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
  isArray,
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
  @IsInt({ each: true })
  skill_id?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  designation_id?: number[];
}
