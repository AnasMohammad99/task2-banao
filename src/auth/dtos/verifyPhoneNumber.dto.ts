import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class VerifyPhoneNumberDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
