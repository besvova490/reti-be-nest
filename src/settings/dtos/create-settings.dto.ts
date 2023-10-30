import { IsBoolean } from 'class-validator';

export class CreateSettingsDto {
  @IsBoolean()
  readonly receiveWeeklyEmails: boolean;

  @IsBoolean()
  readonly receiveRatingAnnouncements: boolean;
}
