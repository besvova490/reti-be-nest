import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';

// entities
import { AbstractEntity } from '../entity/abstract.entity';
import { Settings } from '../settings/settings.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Event } from '../events/event.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  timeZone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column({ nullable: true })
  twoFactorAuthSecret: string;

  @OneToOne(() => Settings, { cascade: true })
  @JoinColumn()
  settings: Settings;

  @ManyToOne(() => Subscription, (subscription) => subscription.users)
  subscription: Subscription;

  @OneToMany(() => Event, (event) => event.author)
  myEvents: Event[];

  @ManyToMany(() => Event, (event) => event.isFavorite)
  favoriteEvents: Event[];

  @ManyToMany(() => Event, (event) => event.guests)
  events: Event[];
}
