import { Injectable } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  LoggerOptions,
  Logger,
} from 'winston';
import { AzureApplicationInsightsLogger } from 'winston-azure-application-insights';
import * as appInsights from 'applicationinsights';
import { MongoClient } from 'mongodb';

@Injectable()
export class LoggerService {
  private logger: Logger;
  private mongoClient: MongoClient;

  constructor() {
    const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    this.mongoClient = new MongoClient(process.env.DATABASE_URL);
    this.mongoClient.connect();

    if (instrumentationKey) {
      appInsights.setup(instrumentationKey).start();
    }

    const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
    const options: LoggerOptions = {
      transports: [
        new transports.Console({
          level: level,
          format: format.combine(format.json()),
        }),
      ],
    };
    this.logger = createLogger(options);

    if (instrumentationKey) {
      this.logger.add(
        new AzureApplicationInsightsLogger({
          client: appInsights.defaultClient,
        }),
      );
    }
  }

  /**
   * Logs an informational message.
   * @param message The message to log.
   */
  async info(message: string) {
    console.log(message);
  }

  /**
   * Logs a warning message.
   * @param message The message to log.
   */
  async warn(message: string) {
    console.log(message);
  }

  /**
   * Logs an error message.
   * @param message The message to log.
   * @param trace Optional trace stack.
   */
  async error(message: string, trace?: string) {
    console.log(message, trace);
  }

  /**
   * Logs a debug message.
   * @param message The message to log.
   */
  async debug(message: string) {
    console.log(message);
  }
  /**
   * Logs an event to the specified audit collection.
   * @param collectionName The name of the collection.
   * @param operationType The type of operation.
   * @param requestId The request ID.
   * @param id The ID of the document.
   * @returns A promise that resolves when the log event has been inserted into the audit collection.
   */
  async logEvent(
    collectionName: string,
    operationType: string,
    requestId: any,
    id: any,
  ): Promise<void> {
    if (collectionName && collectionName.trim() !== '') {
      const auditCollection = this.mongoClient
        .db(process.env.MONGO_DB_NAME)
        .collection(`${collectionName}_audit`);

      const auditLog = {
        timestamp: new Date(),
        operationType,
        requestId,
        id,
      };
      await auditCollection.insertOne(auditLog);
    }
  }
}
