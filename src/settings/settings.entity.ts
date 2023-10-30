import { Entity, Column } from 'typeorm';

// entities
import { AbstractEntity } from '../entity/abstract.entity';

@Entity()
export class Settings extends AbstractEntity {
  @Column()
  receiveWeeklyEmails: boolean;

  @Column()
  receiveRatingAnnouncements: boolean;
}
