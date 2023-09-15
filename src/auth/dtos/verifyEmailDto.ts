import { IsNotEmpty, IsEmail } from 'class-validator';
export class verifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
