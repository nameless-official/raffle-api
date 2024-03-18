import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { DatabaseModule } from 'src/database/database.module';
import { raffleProviders } from './raffle.providers';
import { AuthModule } from 'src/auth/auth.module';
import { RaffleStatusModule } from '../raffle_status/raffle_status.module';
import { PrizeModule } from '../prize/prize.module';

@Module({
  imports: [DatabaseModule, AuthModule, RaffleStatusModule, PrizeModule],
  controllers: [RaffleController],
  providers: [...raffleProviders, RaffleService],
  exports: [RaffleService],
})
export class RaffleModule {}
