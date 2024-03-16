import { Module } from '@nestjs/common';
import { PrizeLevelService } from './prize_level.service';
import { PrizeLevelController } from './prize_level.controller';
import { DatabaseModule } from 'src/database/database.module';
import { prizeLevelProviders } from './prize_level.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PrizeLevelController],
  providers: [...prizeLevelProviders, PrizeLevelService],
  exports: [PrizeLevelService],
})
export class PrizeLevelModule {}
