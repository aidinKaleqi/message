import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessage {
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255, {
    message: 'content must not be more than 255 characters long',
  })
  content: string;
}
