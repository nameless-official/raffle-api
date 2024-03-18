import { Module } from '@nestjs/common';
import { ImagesController } from './image.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ImagesController],
})
export class ImageModule {}
