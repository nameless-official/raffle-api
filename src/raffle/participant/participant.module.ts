import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { DatabaseModule } from 'src/database/database.module';
import { participantProviders } from './participant.providers';
import { AuthModule } from 'src/auth/auth.module';
import { RaffleModule } from '../raffle/raffle.module';
import { DiscordModule } from './../../discord/discord.module';

@Module({
  imports: [DatabaseModule, AuthModule, RaffleModule, DiscordModule],
  controllers: [ParticipantController],
  providers: [...participantProviders, ParticipantService],
})
export class ParticipantModule {}
