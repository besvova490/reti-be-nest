import { Expose } from 'class-transformer';

export class SettingsDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly receiveWeeklyEmails: boolean;

  @Expose()
  readonly receiveRatingAnnouncements: boolean;
}
