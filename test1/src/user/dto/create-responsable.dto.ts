import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateResponsableDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsString()
  telephone: string;

  @IsString()
  serviceName: string;

  @IsNumber()
  servicePrice: number;
}