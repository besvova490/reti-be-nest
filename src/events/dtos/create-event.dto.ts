import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

// helpers
import { IsDateValid } from 'src/helpers/is-date-validator';

export class CreateEventDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsDateValid('YYYY-MM-DD:HH:MM', {
    message: 'Date must be in format YYYY-MM-DD:HH:MM',
  })
  readonly date: string;

  @IsEmail({}, { each: true })
  readonly guests: string[];

  @IsBoolean()
  @IsOptional()
  readonly isFavorite: boolean;
}
