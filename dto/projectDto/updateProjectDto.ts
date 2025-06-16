import { IsString, IsOptional, IsDateString, IsInt, IsNumber } from 'class-validator';

export class UpdateProjectDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  startdate?: string;

  @IsOptional()
  @IsDateString()
  enddate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  pmId?: number;

  @IsOptional()
  @IsInt()
  leadId?: number;
}
