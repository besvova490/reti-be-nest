import { Expose } from 'class-transformer';

export class SubscriptionDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly type: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly eventsCount: number;

  @Expose()
  readonly reportStorageTtl: number;

  @Expose()
  readonly chatInclude: boolean;
}
