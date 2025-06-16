import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsNumber()
  projectId?: string;

  @IsOptional()
  @IsNumber()
  authorId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
