import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';
import * as multer from 'multer';
import { LoggerService } from './logging.service';
import * as appInsights from 'applicationinsights';

const auditCollections = ['members', 'providers', 'visits', 'routes'];
const noRestURL = ['dashboard', 'finder', 'claim', 'cancel'];
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
    ),
    defaultMeta: { service: 'HTTP' },
    transports: [
      new transports.Console(),
    ],
  });

  private upload = multer();

  constructor(private readonly loggingService: LoggerService) { }

  /**
   * Middleware function that logs incoming HTTP requests and outgoing responses.
   * @param req The incoming HTTP request.
   * @param res The outgoing HTTP response.
   * @param next The next middleware function in the chain.
   */
  use(req: Request, res: Response, next: NextFunction) {
    try {

      const { method, originalUrl, params, body, query } = req;
      const start = Date.now();

      // Log the request data
      const requestData = {
        method,
        url: originalUrl,
        params,
        query,
        body,
      };
      console.log('Request Data:', JSON.stringify(requestData, getCircularReplacer()));
      // Extract collection name and id from the URL
      let [collectionName, id] = originalUrl.split('/').slice(1);
      collectionName = collectionName.split('?')[0];
      if (originalUrl.includes('visits')) {
        collectionName = 'visits';
      }
      if (noRestURL.includes(id)) {
        id = originalUrl.split('/').slice(-2)[0];
      }

      // Get the operation ID from Application Insights
      const requestId = appInsights.getCorrelationContext()?.operation.id;

      // Determine the operation type based on the HTTP method
      let operationType = 'Unknown';
      let formData = { ...req.params, ...req.query };
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        formData = { ...formData, ...req.body };
      }
      if (method === 'GET') operationType = 'Read';
      else if (method === 'POST') operationType = 'Create';
      else if (method === 'PUT' || method === 'PATCH') operationType = 'Update';
      else if (method === 'DELETE') operationType = 'Delete';

      // Log the response data when the response finishes
      res.on('finish', () => {
        const { statusCode } = res;
        const responseTime = Date.now() - start;
        const logMessage = `Method: ${method} - URL: ${originalUrl} - Status Code: ${statusCode} - Response Time: ${responseTime}ms`;
        console.log(logMessage);
        // Log the event to the logging service if it's not a third-party API call
        if (auditCollections.includes(collectionName)) {
          this.loggingService.logEvent(collectionName, operationType, requestId, id);
        }
      });
    } catch (error) {
      console.log(error);
    }
    next();
  }
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}