import { Injectable, NotFoundException } from '@nestjs/common';
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
      isFavorite: event.isFavorite?.some((item) => item.id === user.id),
    }));
  }

  async findOne(id: number) {
    const data = await this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.guests', 'guests')
      .leftJoinAndSelect('event.author', 'author')
      .where({ id })
      .getOne();

    return data;
  }

  async update(id: number, data: UpdateEventDto) {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const guests = data.guests?.length
      ? await this.usersService.findByEmails(data.guests)
      : [];
    event.guests = [...guests, event.author];
    event.isFavorite = data.isFavorite && [event.author];

    return this.repo.save(Object.assign(event, data));
  }

  async remove(id: number) {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.repo.remove(event);
  }
}
