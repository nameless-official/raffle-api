import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import { DatabaseModule } from 'src/database/database.module';
import { prizeProviders } from './prize.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PrizeController],
  providers: [...prizeProviders, PrizeService],
})
export class PrizeModule {}
