import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, RoleModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
