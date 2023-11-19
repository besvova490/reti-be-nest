import { Expose, Transform } from 'class-transformer';

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

  @Expose()
  @Transform(
    ({ obj }) =>
      obj.favoriteEvents?.map((item) => ({ id: item.id, name: item.name })) ||
      [],
  )
  favoriteEvents: { id: number; name: string }[];
}
