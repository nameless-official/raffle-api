import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { DatabaseModule } from 'src/database/database.module';
import { raffleProviders } from './raffle.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [RaffleController],
  providers: [...raffleProviders, RaffleService],
  exports: [RaffleService],
})
export class RaffleModule {}
