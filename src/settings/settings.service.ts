import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Settings) private repo: Repository<Settings>) {}

  create() {
    const settings = this.repo.create({
      receiveWeeklyEmails: true,
      receiveRatingAnnouncements: true,
    });

    return this.repo.save(settings);
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Settings>) {
    const settings = await this.findOne(id);

    if (!settings) {
      throw new Error('Settings not found');
    }

    return this.repo.save({ ...settings, ...data });
  }
}
