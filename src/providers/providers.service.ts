import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Provider, ProviderDocument } from './schemas/provider.schema';
import { LoggerService } from '../common/logging/logging.service';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as XLSX from 'xlsx';
import { writeFile } from 'fs/promises';
import {
  ProviderLookup,
  ProviderLookupDocument,
} from './schemas/providerlookup.schema';
import {
  ProviderSlot,
  ProviderSlotDocument,
} from './schemas/providerslot.schema';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { UpdateProviderSlotDto } from './dto/update.provider.slots.dto';
import {
  getRandomTime,
  timeToEndTimestamp,
  timeToTimestamp,
} from 'src/common/helpers/common.util';
import { CreateProviderSlotDto } from './dto/create.provider.slots.dto';

interface Slot {
  calendarDate: string;
  startTime: string;
  endTime: string;
  startTime1: string;
  endTime1: string;
  changed: string;
  isWorking: boolean;
  reasonId: number;
}
@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name)
    private providerModel: Model<ProviderDocument>,
    @InjectModel(ProviderLookup.name)
    private providerLookupModel: Model<ProviderLookupDocument>,
    @InjectModel(ProviderSlot.name)
    private providerSlotModel: Model<ProviderSlotDocument>,
    @Inject(ConfigService) private config: ConfigService,
    @Inject(LoggerService) private logger: LoggerService,
  ) {}

  /**
   * Find a provider by ID
   * @param id The ID of the provider to find
   * @returns The provider with the given ID
   * @throws Error if the provider with the given ID is not found
   */
  async findOne(id: string): Promise<ProviderSlot> {
    this.logger.info(`Finding provider with ID: ${id}`);
    try {
      const providerSlot = await this.providerSlotModel
        .findOne({ providerId: id })
        .exec();
      this.logger.info(`Found provider with ID: ${id}`);
      if (!providerSlot) {
        throw new Error(`Provider with ID: ${id} not found`);
      }
      return providerSlot;
    } catch (error) {
      this.logger.error(`Error finding provider with ID: ${id}`, error.stack);
      throw error;
    }
  }
  /**
   * Deletes slots that match the given query.
   * @param {string} query - The query to match slots.
   * @returns {Promise<DeleteWriteOpResultObject>} The result of the delete operation.
   * @throws {Error} If no slots are found or an error occurs during the delete operation.
   */
  async remove(query: string): Promise<any> {
    this.logger.info(`Deleting Slots with query: ${query}`);
    try {
      const deleteResult = await this.providerSlotModel
        .deleteMany(JSON.parse(query))
        .exec();
      this.logger.info(`Deleted Slots ${deleteResult} with query: ${query}`);
      return deleteResult;
    } catch (error) {
      this.logger.error(
        `Error Deleting Slots with query: ${query}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds slots that match the given query.
   * @param {string} query - The query to match slots.
   * @returns {Promise<ProviderSlot[]>} The slots that match the query.
   * @throws {Error} If no slots are found or an error occurs during the find operation.
   */
  async findSlots(query: string): Promise<ProviderSlot[]> {
    this.logger.info(`Finding Slots with query: ${query}`);
    try {
      const providerSlots = await this.providerSlotModel
        .find(JSON.parse(query))
        .exec();
      if (providerSlots.length === 0) {
        throw new Error(`Slots with query: ${query} not found`);
      }
      return providerSlots;
    } catch (error) {
      this.logger.error(
        `Error finding Slots with query: ${query}`,
        error.stack,
      );
      throw error;
    }
  }
  /**
   * Updates all provider slots with the given data.
   * @param {any} providerSlotData - The data to update the provider slots with.
   */
  async updateAllSlots(providerSlotData: any) {
    this.logger.info('Update all providers');

    const bulkOps = [];

    // Iterate over each provider in the data
    for (const provider of providerSlotData) {
      // Cast the Slots property to a Slot array
      this.logger.info(JSON.stringify(provider));
      const slotList = provider.slots as Slot[];

      // Iterate over each slot in the slot list
      for (const slot of slotList) {
        // Convert the CalendarDate property to a Date object
        const slotDate = new Date(slot.calendarDate);
        const query: { staffResourceId: number; $or?: any[] } = {
          staffResourceId: provider.staffResourceId,
        };

        query.$or = [];
        // Convert the start and end times to timestamps
        const startTime = timeToTimestamp(slot.startTime, slotDate);
        const endTime = timeToTimestamp(slot.endTime, slotDate);
        const startTime1 = timeToTimestamp(slot.startTime1, slotDate);
        const endTime1 = timeToTimestamp(slot.endTime1, slotDate);

        // Add the time ranges to the $or array in the query
        query.$or.push(
          {
            slotTime: {
              $gte: new Date(startTime),
              $lt: new Date(endTime),
            },
          },
          {
            slotTime: {
              $gte: new Date(startTime1),
              $lt: new Date(endTime1),
            },
          },
        );

        const update = {
          $set: {
            status: 'available',
            serviceId: 'Available',
            startDateTime: startTime,
            endDateTime: endTime,
            startTime1: startTime1,
            endTime1: endTime1,
            changed: slot.changed,
            reasonId: slot.reasonId,
          },
        };

        bulkOps.push({
          updateMany: {
            filter: query,
            update: update,
          },
        });
      }
    }

    const batchSize = 2000; // Define your batch size here

    for (let i = 0; i < bulkOps.length; i += batchSize) {
      const batch = bulkOps.slice(i, i + batchSize);
      const updateResult = await this.providerSlotModel.bulkWrite(batch);
      this.logger.info(
        `${updateResult.modifiedCount} document(s) was/were updated in batch ${
          i / batchSize + 1
        }.`,
      );
    }
  }
  /**
   * Updates slots for a specific provider and date.
   * @param {UpdateProviderSlotDto} slotDto - The data to update the slots with.
   * @param {any} providerSlotData - The data to update the slots with.
   */
  async updateSlots(slotDto: UpdateProviderSlotDto, providerSlotData: any) {
    this.logger.info('Update slots for specific provider and date');

    for (const provider of slotDto.slots) {
      const providers = providerSlotData.filter(
        (p: any) => p.StaffResourceId === provider.staffResourceId,
      );
      if (!providers.length) {
        this.logger.warn(
          `No providers found with staffResourceIds ${provider.staffResourceId}`,
        );
      }
      const query: { staffResourceId: number; $or?: any[] } = {
        staffResourceId: provider.staffResourceId,
      };

      query.$or = [];

      const slotList = providers[0].Slots as Slot[];
      let filteredSlots = slotList;
      this.logger.info(JSON.stringify(providers[0]));
      this.logger.info(JSON.stringify(slotList));

      if (provider.calendarDates.length > 0) {
        filteredSlots = slotList.filter((slot: any) =>
          provider.calendarDates.includes(slot.CalendarDate),
        );
      }
      for (const slot of filteredSlots) {
        const slotDate = new Date(slot.calendarDate);
        const startTime = timeToTimestamp(slot.startTime, slotDate);
        const endTime = timeToEndTimestamp(slot.endTime, slotDate);
        const startTime1 = timeToTimestamp(slot.startTime1, slotDate);
        const endTime1 = timeToEndTimestamp(slot.endTime1, slotDate);

        query.$or.push(
          {
            slotTime: {
              $gte: new Date(startTime),
              $lt: new Date(endTime),
            },
          },
          {
            slotTime: {
              $gte: new Date(startTime1),
              $lt: new Date(endTime1),
            },
          },
        );
      }

      this.logger.info('Query : ' + JSON.stringify(query));
      const updateResult = await this.updateDocuments(query);
      this.logger.info(
        `${updateResult.modifiedCount} document(s) was/were updated.`,
      );
    }
  }

  /**
   * Updates slots for a specific provider and date.
   * @param {UpdateProviderSlotDto} slotDto - The data to update the slots with.
   * @param {any} providerSlotData - The data to update the slots with.
   */
  async update(slotDto: UpdateProviderSlotDto) {
    try {
      this.logger.info('Update slots ');
      const blobConnString = this.config.get('BLOB_URL');
      const containerName = this.config.get('BLOB_CONTAINER_NAME');
      let blobName = this.config.get('BLOB_FILE_NAME');

      if (slotDto.fileName) {
        blobName = slotDto.fileName;
      }
      let blobText;
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(blobConnString);
      this.logger.info(`Blob Name: ${blobName}`);
      this.logger.info(`Container Name: ${containerName}`);
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobs = containerClient.listBlobsFlat({ prefix: blobName });
      for await (const blob of blobs) {
        this.logger.info(`Blob>>>>>> ${blob.name} exists`);
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        const downloadBlockBlobResponse =
          await blockBlobClient.downloadToBuffer();
        blobText = downloadBlockBlobResponse.toString();
        if (!blobText) {
          this.logger.info('Blob Text : ' + blobText.length);
        }
        const providerData = JSON.parse(blobText);
        // this.logger.info('>>>>' + JSON.stringify(providerData));
        if (
          !slotDto.slots ||
          slotDto.slots == null ||
          slotDto.slots == undefined ||
          Object.keys(slotDto).length === 0
        ) {
          await this.updateAllSlots(providerData);
        } else {
          this.updateSlots(slotDto, providerData);
        }
      }
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }

  /**
   * This method creates slots based on the provided slot data.
   *
   * @param {CreateProviderSlotDto} providerSlotDto - The data transfer object containing the details for the slots to be created.
   * @returns {Promise} - A promise that resolves when the slots have been created.
   *
   * @throws {Error} - Throws an error if there is a problem creating the slots.
   */
  async createSlots(providerSlotDto: CreateProviderSlotDto) {
    this.logger.info('Starting to create slots...');
    const providerList = await this.providerModel.find({});
    this.logger.info(`Found ${providerList.length} providers`);

    let startDate;

    let endDate;
    if (!providerSlotDto.startDate) {
      startDate = new Date(2024, 0, 29);
    } else {
      const [year, month, day] = providerSlotDto.startDate.split('-');
      startDate = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
      );
    }

    startDate.setHours(5, 0, 0, 0);
    this.logger.info('Start Date : ' + startDate);
    if (!providerSlotDto.endDate) {
      endDate = new Date();
      endDate.setDate(startDate.getDate() + 99);
    } else {
      const [year, month, day] = providerSlotDto.endDate.split('-');
      endDate = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
      );
    }
    endDate.setHours(5, 0, 0, 0);
    const appointments = [];
    let start = providerSlotDto.startTime;
    let end = providerSlotDto.endTime;
    if (!start && start == undefined) {
      start = 0;
    }
    if (!end && end == undefined) {
      end = 23;
    }

    const count = 99;
    providerList.forEach((provider) => {
      this.logger.info(`Processing provider: ${JSON.stringify(provider)}`);
      for (let i = 0; i < count; i++) {
        const date = moment(startDate).add(i, 'days');

        for (let hour = start; hour <= end; hour++) {
          // from 8am to 5pm
          const appointment = {
            providerId: provider.providerId,
            date: date.toDate(),
            msa: provider['msa'],
            staffResourceId: provider.staffResourceId,
            firstName: provider.profile.firstName,
            lastName: provider.profile.lastName,
            middleName: provider.profile.middleName,
            providerName: `${provider.profile.firstName} ${provider.profile.lastName}`,
            programs: provider.programs,
            clients: provider.clients,
            products: provider.products,
            email: provider.profile.contactInfo.emailAddress,
            duration: 'PT1H',
            fullTime: provider.fullTime,
            slotTime: moment(date).add(hour, 'hours').toDate(),
            slotEndTime: moment(date)
              .add(hour + 1, 'hours')
              .toDate(),
            startDateTime: null,
            endDateTime: null,
            timeZone: 'UTC',
            status: 'Unavailable',
            changed: '',
            reasonId: 1,
            isWorking: true,
            serviceId: 'Unavailable',
            toBeExtracted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            serviceNotes: '',
          };

          appointments.push(appointment);
        }
      }
    });
    this.logger.info(`Created ${appointments.length} appointments`);
    // Insert the appointments into the collection
    try {
      for (let i = 0; i < appointments.length; i += 2000) {
        this.logger.info(`Inserting ${i} to ${i + 2000} documents`);
        const batch = appointments.slice(i, i + 2000);
        await this.providerSlotModel.insertMany(batch);
        Object.keys(require.cache).forEach(function (key) {
          delete require.cache[key];
        });
      }
    } catch (err) {
      this.logger.error(
        `Something went wrong trying to insert the new documents: ${err}\n`,
      );
    }

    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });
  }

  // Method to update provider slots
  private async updateDocuments(query: any) {
    const update = {
      $set: {
        status: 'available',
        serviceId: 'Available',
      },
    };
    //  const result = await this.providerSlotModel.find(query);
    // this.logger.info('Result : ' + JSON.stringify(result));
    return await this.providerSlotModel.updateMany(query, update);
  }

  /**
   * Updates documents based on a query.
   * @param query
   * @param update
   * @returns
   */
  public async updateDocumentsByQuery(query: any, update: any) {
    return await this.providerSlotModel.updateMany(query, update);
  }
}
