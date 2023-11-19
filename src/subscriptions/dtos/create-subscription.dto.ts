import { IsString, IsNumber, IsBoolean, Max, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  readonly type: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  readonly price: number;

  @IsNumber()
  @Min(5)
  @Max(1000)
  readonly eventsCount: number;

  @IsNumber()
  @Min(0)
  @Max(864_000_000)
  readonly reportStorageTtl: number;

  @IsBoolean()
  readonly chatInclude: boolean;
}
