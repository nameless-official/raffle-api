import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RaffleStatusModule } from './raffle/raffle_status/raffle_status.module';
import { PrizeLevelModule } from './raffle/prize_level/prize_level.module';
import { RaffleModule } from './raffle/raffle/raffle.module';
import { PrizeModule } from './raffle/prize/prize.module';
import { ParticipantModule } from './raffle/participant/participant.module';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RoleModule,
    CommonModule,
    RaffleStatusModule,
    RaffleModule,
    PrizeLevelModule,
    PrizeModule,
    ParticipantModule,
    DiscordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
