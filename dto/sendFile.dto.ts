import { IsNotEmpty, IsString } from 'class-validator';

export class SendFileDto {
  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
