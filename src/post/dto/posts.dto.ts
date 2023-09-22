import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsOptional()
  user_id: number;
  @IsString()
  @IsNotEmpty()
  description: string;
}
export class updatePostDto {
  @IsNumber()
  @IsOptional()
  user_id: number;
  @IsString()
  @IsOptional()
  description: string;
}

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}