import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsBoolean()
  @IsOptional()
  readonly receiveWeeklyEmails: boolean;

  @IsBoolean()
  @IsOptional()
  readonly receiveRatingAnnouncements: boolean;
}
