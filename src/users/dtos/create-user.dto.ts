import { IsEmail, IsString, IsTimeZone, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly logo: string;

  @IsOptional()
  @IsTimeZone()
  readonly timeZone: string;
}
