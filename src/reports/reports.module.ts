import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingModule } from 'src/common/logging/logging.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [LoggingModule, MongooseModule],
  exports: [ReportsService],
})
export class ReportingModule {}
