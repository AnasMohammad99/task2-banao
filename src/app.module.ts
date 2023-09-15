import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './jwtAuthGuard';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    MailerModule.forRoot({
      transport: {
        service: 'outlook',
        auth: {
          user: process.env.HOST_EMAIL,
          pass: process.env.HOST_EMAIL_PASSWORD,
        },
        tls:{
          rejectUnauthorized: false
        }
      },
    }),
  ],

  controllers: [AppController],
  providers: [JwtAuthGuard, AppService],
})
export class AppModule {}
