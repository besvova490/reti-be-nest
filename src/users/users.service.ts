import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// entities
import { User } from './user.entity';

// services
import { SettingsService } from '../settings/settings.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

// dtos
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private settingsService: SettingsService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async create({
    email,
    password,
    firstName,
    lastName,
    logo,
    timeZone,
  }: CreateUserDto) {
    const user = await this.repo.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.repo.create({
      email,
      password,
      firstName,
      lastName,
      logo,
      timeZone,
    });

    const settings = await this.settingsService.create();
    const freeSubscription = await this.subscriptionsService.find({
      type: 'free',
    });

    newUser.settings = settings;
    newUser.subscription = freeSubscription;

    return this.repo.save(newUser);
  }

  async findOne({
    id,
    email,
    relations,
  }: {
    id?: number;
    email?: string;
    relations?: string[];
  }) {
    const user = await this.repo.findOne({
      where: { id, email, isActive: true },
      relations,
    });

    return user;
  }

  async findUserSettings(id: number) {
    const user = await this.findOne({ id, relations: ['settings'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.settings;
  }

  async findUserSubscription(id: number) {
    const user = await this.findOne({ id, relations: ['subscription'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.subscription;
  }

  async findAll({ email }) {
    return this.repo.find({ where: { email, isActive: true } });
  }

  async findByEmails(emails: string[]) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('email IN (:...emails)', { emails })
      .getRawMany();
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.save({ ...user, ...data });
  }

  async remove(id: number) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.save({ ...user, isActive: false });
  }
}
