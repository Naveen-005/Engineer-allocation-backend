import { IsString, IsOptional, IsDateString, IsInt, IsNumber } from 'class-validator';

export class CreateProjectDto {

  @IsNumber()
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
}
