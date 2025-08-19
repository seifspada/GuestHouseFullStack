import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNumber, IsDate } from 'class-validator';
import { UserRole } from '../../user/schema/user.schema';
import { Type } from 'class-transformer';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  telephone: string;

  @IsEnum(UserRole, { message: 'Role must be admin, responsable, or user' })
  role: UserRole;

   @IsOptional()
  @IsEnum(['present', 'absent'], { message: 'Status must be present or absent' })
  status: string = 'absent'; // Default to 'absent'


  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateNaissance?: Date;
}