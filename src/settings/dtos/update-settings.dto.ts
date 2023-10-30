import { IsBoolean, IsOptional } from 'class-validator';

export class CreateSettingsDto {
  @IsBoolean()
  @IsOptional()
  readonly receiveWeeklyEmails: boolean;

  @IsBoolean()
  @IsOptional()
  readonly receiveRatingAnnouncements: boolean;
}
