import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  logo: string;

  @Expose()
  timeZone: string;

  @Expose()
  createdAt: Date;
}
