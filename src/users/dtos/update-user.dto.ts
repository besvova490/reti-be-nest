import { IsEmail, IsString, IsTimeZone, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly logo: string;

  @IsString()
  @IsOptional()
  readonly twoFactorAuthSecret: string;

  @IsString()
  @IsOptional()
  readonly isTwoFactorAuthEnabled: boolean;

  @IsTimeZone()
  @IsOptional()
  readonly timeZone: string;
}
