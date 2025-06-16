import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
