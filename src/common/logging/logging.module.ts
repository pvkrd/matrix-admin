import { Module } from '@nestjs/common';
import { LoggerService } from './logging.service';
import { MongoAuditService } from './mongo.audit.service';


@Module({
  providers: [LoggerService, MongoAuditService],
  exports: [LoggerService, MongoAuditService],
})
export class LoggingModule { }