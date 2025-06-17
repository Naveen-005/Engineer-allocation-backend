import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDateString, IsInt, IsNumber, IsArray, ValidateNested } from 'class-validator';
import CreateRequirementDto from '../requirementDto/createRequirementDto';

export class CreateProjectDto {

  @IsString()
  project_id : string;

  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  startdate?: string;

  @IsOptional()
  @IsDateString()
  enddate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsInt()
  pmId: number; 

  @IsInt()
  leadId: number; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequirementDto)
  requirements: CreateRequirementDto[];
}
