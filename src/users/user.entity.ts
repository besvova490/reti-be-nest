import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

// entities
import { AbstractEntity } from '../entity/abstract.entity';
import { Settings } from '../settings/settings.entity';

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

  @OneToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  settings: Settings;
}
