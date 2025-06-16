import { IsString, IsOptional, IsDateString, IsInt, IsNumber } from 'class-validator';

export class CreateProjectDto {

  @IsNumber()
  project_id : number;

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
