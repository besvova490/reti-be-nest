import { IsString } from 'class-validator';

export class TwoFactorDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly twoFactorCode: string;
}
