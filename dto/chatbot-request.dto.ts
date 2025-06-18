import { IsString, IsNotEmpty } from "class-validator";

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Query string must not be empty" })
  query: string;
}
