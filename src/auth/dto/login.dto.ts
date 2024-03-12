import { IsBase64, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsBase64({ message: 'The sent password must be in base64' })
  @MinLength(6)
  password: string;
}
