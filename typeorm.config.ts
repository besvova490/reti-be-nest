import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// helpers
import { databaseConfig } from 'src/database/database.config';

// config();
const configService = new ConfigService();
export default new DataSource(databaseConfig(configService));
