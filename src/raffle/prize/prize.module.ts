import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import { DatabaseModule } from 'src/database/database.module';
import { prizeProviders } from './prize.providers';
import { AuthModule } from 'src/auth/auth.module';
import { PrizeLevelModule } from '../prize_level/prize_level.module';

@Module({
  imports: [DatabaseModule, AuthModule, PrizeLevelModule],
  controllers: [PrizeController],
  providers: [...prizeProviders, PrizeService],
  exports: [PrizeService],
})
export class PrizeModule {}
