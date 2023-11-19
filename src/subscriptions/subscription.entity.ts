import { Entity, Column, OneToMany } from 'typeorm';

// entity
import { AbstractEntity } from '../entity/abstract.entity';
import { User } from '../users/user.entity';

@Entity()
export class Subscription extends AbstractEntity {
  @Column()
  type: string;

  @Column()
  price: number;

  @Column({ default: 5 })
  eventsCount: number;

  @Column({ default: 259_200_000 })
  reportStorageTtl: number;

  @Column({ default: false })
  chatInclude: boolean;

  @OneToMany(() => User, (user) => user.subscription)
  users: User[];
}
