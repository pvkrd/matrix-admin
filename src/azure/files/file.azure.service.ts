import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesAzureService {
  constructor(private readonly configService: ConfigService) {}

  private getBlobServiceClient() {
    const frontDoorUrl = this.configService.get('AZURE_BLOB_FRONT_DOOR_URL');
    return new BlobServiceClient(frontDoorUrl);
  }

  // not in use
  private async getBlobServiceInstance() {
    const connectionString = this.configService.get(
      'AZURE_BLOB_CONNECTION_STRING',
    );
    const blobClientService =
      BlobServiceClient.fromConnectionString(connectionString);
    return blobClientService;
  }

  private async getBlobClient(
    imageName: string,
    containerName: string,
  ): Promise<BlockBlobClient> {
    const blobServiceClient = this.getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    return blockBlobClient;
  }

  private async getContainerClient(
    containerName: string,
  ): Promise<ContainerClient> {
    const blobServiceClient = this.getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return containerClient;
  }

  public async uploadFile(file: Express.Multer.File, containerName: string) {
    const blockBlobClient = await this.getBlobClient(
      file.filename,
      containerName,
    );

    await blockBlobClient.uploadStream(file.stream, file.size, 5, {
      // 5MB block size for concurrency);
      blobHTTPHeaders: {
        blobContentType: file.mimetype, // Set the correct MIME type
      },
    });

    /* await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype, // Set the correct MIME type
      },
    }); */

    return blockBlobClient.url;
  }

  async deleteFile(file_name: string, containerName: string) {
    try {
      const blockBlobClient = await this.getBlobClient(
        file_name,
        containerName,
      );
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      console.log(error);
    }
  }

  public async downloadFile(file_name: string, containerName: string) {
    const blockBlobClient = await this.getBlobClient(file_name, containerName);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    const downloaded = (
      await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    return downloaded;
  }

  // //add listBlobsFlat to get all files in a container
  // public async listBlobsFlat(containerName: string, folderName: string) {
  //   const containerClient = await this.getContainerClient(containerName);
  //   const blobIterator = containerClient.listBlobsFlat({
  //     prefix: folderName,
  //   });
  //   return blobIterator;
  // }

  private streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }
}
