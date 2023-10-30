import { Expose } from 'class-transformer';

export class CreateSettingsDto {
  @Expose()
  readonly receiveWeeklyEmails: boolean;

  @Expose()
  readonly receiveRatingAnnouncements: boolean;
}
