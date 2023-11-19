import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly date: string;

  @IsEmail({}, { each: true })
  readonly guests: string[];

  @IsBoolean()
  @IsOptional()
  readonly isFavorite: boolean;
}
