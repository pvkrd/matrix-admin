import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailModule } from './common/email-utils/email.module';
import { SmsModule } from './common/sms-utils/sms.module';

import { LoggingModule } from './common/logging/logging.module';
import { LoggingMiddleware } from './common/logging/azure.logging';
import { AuthModule } from './auth-module/auth.module';
import { ReportingModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
        // autoEncryption: await getAutoEncryption(config),
      }),
    }),

    LoggingModule,
    ProvidersModule,
    ReportingModule,
    EmailModule,
    SmsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [LoggingMiddleware, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
