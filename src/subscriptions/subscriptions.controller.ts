import { Controller, Get } from '@nestjs/common';

// services
import { SubscriptionsService } from './subscriptions.service';

// interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

// dtos
import { SubscriptionDto } from './dtos/subscription.dto';

@Serialize(SubscriptionDto)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  getAllSubscriptions() {
    return this.subscriptionsService.findAll();
  }
}
