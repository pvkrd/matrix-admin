import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
const { MongoClient } = require('mongodb');
const moment = require('moment');
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LoggerService } from '../common/logging/logging.service';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { writeFile } from 'fs/promises';
import { Connection } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class ReportsService {
  private readonly reportTypeCollectionMap = {
    unclaimed: 'visits',
    nurseview: 'provider_slots',
    claimed: 'visits',
    utilization: 'provider_slots',
    eligibility: 'member_lookups',
    visitcount: 'visits',
  };

  constructor(
    @Inject(ConfigService) private config: ConfigService,
    @Inject(LoggerService) private logger: LoggerService,
    @InjectConnection() private connection: Connection,
  ) {}

  async getReport(reportType: string): Promise<any> {
    // Log the start of the report generation
    this.logger.info(`Generating report: ${reportType}`);

    const collectionName = this.reportTypeCollectionMap[reportType];
    if (!collectionName) {
      throw new NotFoundException(`Report type ${reportType} is not supported`);
    }

    try {
      const mongoClient = this.connection.getClient();
      const db = mongoClient.db('matrix');

      const queryFilePath = path.join(__dirname, `${reportType}.json`);
      const queryFileContent = await fs.promises.readFile(
        queryFilePath,
        'utf8',
      );
      const query = JSON.parse(queryFileContent);

      const collection = db.collection(collectionName);
      const reportResponse = await collection.aggregate(query).toArray();

      if (!reportResponse || reportResponse.length === 0) {
        throw new NotFoundException(`No data found for report: ${reportType}`);
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Define the header style
      const headerStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF000080' }, // Dark blue
        },
        font: {
          color: { argb: 'FFFFFFFF' }, // White
          bold: true,
          size: 14, // Set this to the desired size
        },
        alignment: {
          horizontal: 'center',
        },
      };

      const dataStyle = {
        border: {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        },
      };
      // Write the headers to the first row of the worksheet
      const headers = Object.keys(reportResponse[0]);
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(1, index + 1);
        cell.value = header;
        cell.style = headerStyle as any;
        worksheet.getColumn(index + 1).width = 20;
      });
      worksheet.getRow(1).height = 20;

      reportResponse.forEach((row, rowIndex) => {
        headers.forEach((header, columnIndex) => {
          const cell = worksheet.getCell(rowIndex + 2, columnIndex + 1);
          if (row[header] instanceof Date) {
            cell.value = row[header].toISOString();
          } else {
            cell.value = row[header];
          }
          cell.style = dataStyle as any;
        });
      });

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      this.logger.error(`Error generating report: ${reportType}`, error.stack);
      throw error;
    }
  }
}
