import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// services
import { SettingsService } from './settings.service';

// entities
import { Settings } from './settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingsService, JwtService],
  exports: [SettingsService],
})
export class SettingsModule {}
