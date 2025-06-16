import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
