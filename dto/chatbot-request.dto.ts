// src/dto/chat-request.dto.ts
import { IsString, Length } from "class-validator";

export class ChatRequestDto {
  @IsString()
  @Length(3, 500)
  query!: string;
}
