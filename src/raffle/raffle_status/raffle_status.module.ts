import { Module } from '@nestjs/common';
import { RaffleStatusService } from './raffle_status.service';
import { RaffleStatusController } from './raffle_status.controller';
import { DatabaseModule } from 'src/database/database.module';
import { raffleStatusProviders } from './raffle_status.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [RaffleStatusController],
  providers: [...raffleStatusProviders, RaffleStatusService],
})
export class RaffleStatusModule {}
