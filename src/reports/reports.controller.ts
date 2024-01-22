import { Controller, Get, Query, Res, Inject } from '@nestjs/common';

import { ReportsService } from './reports.service';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { Readable } from 'stream';
const BLOB_URL_KEY = 'BLOB_URL';
const CONTAINER_NAME = 'BLOB_CONTAINER_NAME';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  private bClient: BlobServiceClient;
  private cClient: ContainerClient;

  constructor(
    private readonly reportService: ReportsService,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    const blobConnString = this.config.get(BLOB_URL_KEY);
    this.bClient = BlobServiceClient.fromConnectionString(blobConnString);
    this.cClient = this.bClient.getContainerClient(
      this.config.get(CONTAINER_NAME),
    );
  }

  /**
   * Generates a report and sends it to the client.
   * @param {string} reportType - The type of the report to generate.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  @Get('generate')
  async getReports(
    @Query('reportType') reportType: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.reportService.getReport(reportType);
      const fileName = `${reportType}.xlsx`;

      await fs.promises.writeFile(fileName, result);
      await this.upload(result, reportType);

      res.download(fileName, async (err) => {
        if (err) {
          console.error(err);
        }

        await fs.promises.unlink(fileName);
      });
    } catch (error) {
      console.error(`Error generating report: ${reportType}`, error);
      throw error;
    }
  }

  /**
   * Uploads a report to Azure Blob Storage.
   * @param {Buffer} result - The report data.
   * @param {string} reportType - The type of the report.
   * @throws {Error} If an error occurs during the upload.
   */
  async upload(result: Buffer, reportType: string) {
    try {
      const blobName = `/reports/${reportType}/${moment().format(
        'YYYY-MM-DD',
      )}/${reportType}-${moment().format('HH-mm-ss-SSS')}.csv`;
      const blockBlobClient = this.cClient.getBlockBlobClient(blobName);
      const stream = Readable.from(result);
      await blockBlobClient.uploadStream(stream, Buffer.byteLength(result));
    } catch (error) {
      console.error(`Error uploading report: ${reportType}`, error);
      throw error;
    }
  }
}
