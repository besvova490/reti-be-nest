import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

// services
import { UsersService } from '../users/users.service';

// dtos
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

// entities
import { Event } from './event.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    private usersService: UsersService,
  ) {}

  async create(data: CreateEventDto, user: User) {
    const event = this.repo.create({
      name: data.name,
      description: data.description,
      date: data.date,
      author: user,
      room: randomBytes(16).toString('hex'),
    });

    const guests = data.guests?.length
      ? await this.usersService.findByEmails(data.guests)
      : [];
    event.guests = [...guests, user];
    event.isFavorite = data.isFavorite && [user];

    return this.repo.save(event);
  }

  async findAll(user: User) {
    const data = await this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.guests', 'guests')
      .leftJoinAndSelect('event.isFavorite', 'isFavorite')
      .where({ author: user.id })
      .orWhere('guests.id = :id', { id: user.id })
      .getMany();

    return data.map((event) => ({
      ...event,
      isFavorite: event?.isFavorite.some((item) => item.id === user.id),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, data: UpdateEventDto) {
    return `This action updates a #${id} event ${data}`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
