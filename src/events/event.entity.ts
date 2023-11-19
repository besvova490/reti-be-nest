import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';

// entities
import { AbstractEntity } from '../entity/abstract.entity';

// entities
import { User } from '../users/user.entity';

export enum EventStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
}

@Entity()
export class Event extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date: string;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Column()
  room: string;

  @ManyToOne(() => User, (user) => user.myEvents)
  author: User;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  guests: User[];

  @ManyToMany(() => User, (user) => user.favoriteEvents)
  @JoinTable()
  isFavorite: User[];
}
