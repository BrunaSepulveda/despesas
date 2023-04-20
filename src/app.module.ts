import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { APP_PIPE } from '@nestjs/core';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ExpenseService } from './expense/expense.service';
import { ExpenseRepository } from './expense/expense.repository';
import { ExpenseController } from './expense/expense.controller';
import ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...ormconfig,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    AppConfigModule,
    TypeOrmModule.forFeature([ExpenseRepository, UserRepository]),
  ],
  controllers: [UserController, ExpenseController],
  providers: [
    AuthService,
    UserService,
    ExpenseService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
