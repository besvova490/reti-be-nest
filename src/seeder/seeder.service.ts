import { Injectable } from '@nestjs/common';

// services
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class SeederService {
  constructor(private subscriptionsService: SubscriptionsService) {}

  async seed() {
    return Promise.all(this.subscriptionsService.createAll());
  }
}
