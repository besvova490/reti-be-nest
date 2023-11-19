import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { Subscription } from './subscription.entity';

// dtos
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

// seeders
import SUBSCRIPTIONS_DATA from './subscription.seed';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
  ) {}

  create(subscription: CreateSubscriptionDto) {
    const newSubscription = this.repo.create(subscription);

    return this.repo.save(newSubscription);
  }

  createAll() {
    return SUBSCRIPTIONS_DATA.map(async (subscription: CreateSubscriptionDto) =>
      this.create(subscription),
    );
  }

  findAll() {
    return this.repo.find();
  }

  find({ id, type }: { id?: number; type?: string }) {
    return this.repo.findOne({ where: { id, type } });
  }
}
