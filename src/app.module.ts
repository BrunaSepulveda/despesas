import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { User } from './user/user.entity';
import { Expense } from './expense/expense.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...ormconfig,
      entities: [User, Expense],
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([ExpenseRepository, UserRepository]),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_EMAIL,
        secure: false,
        port: Number(process.env.PORT_EMAIL),
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASSWORD_EMAIL,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      },
    }),
  ],
  controllers: [UserController, ExpenseController],
  providers: [
    ExpenseRepository,
    UserRepository,
    AuthService,
    UserService,
    ExpenseService,
    MailService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
