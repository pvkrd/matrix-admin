import {
  Controller,
  Get,
  Delete,
  Patch,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderSlotDto } from './dto/create.provider.slots.dto';
import { UpdateProviderSlotDto } from './dto/update.provider.slots.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providerService: ProvidersService) {}

  /**
   * Get slots based on a query
   * @param query The query to find slots
   * @returns The slots that match the query
   */
  @Get('slots')
  async getSlots(@Query('query') query: string): Promise<any> {
    return this.providerService.findSlots(query);
  }

  /**
   * Delete a slot based on a query
   * @param query The query to find slots to delete
   * @returns The result of the delete operation
   */
  @Delete('slots')
  async removeString(@Query('query') query: string): Promise<any> {
    return this.providerService.remove(query);
  }

  /**
   * Update a slot
   * @param providerSlotDto The data to update the slot
   * @returns The result of the update operation
   */
  @Patch('slots')
  async update(
    @Body() providerSlotDto: UpdateProviderSlotDto,
  ): Promise<string> {
    try {
      await this.providerService.update(providerSlotDto);
      return 'Success';
    } catch (err) {
      console.error(err);
      throw new Error('Error updating slot');
    }
  }

  /**
   * Update documents reason
   * @param query The query to find documents to update
   * @param update The update to apply
   * @returns The result of the update operation
   */
  @Patch('slots/update')
  async emails(
    @Query('query') query: string,
    @Query('update') update: string,
  ): Promise<string> {
    try {
      await this.providerService.updateDocumentsByQuery(query, update);
      return 'Success';
    } catch (error) {
      console.error(error);
      throw new Error('Error updating documents reason');
    }
  }

  /**
   * Create slots
   * @param providerSlotDto The data to create the slots
   * @returns The result of the create operation
   */
  @Post('slots')
  async createSlots(
    @Body() providerSlotDto: CreateProviderSlotDto,
  ): Promise<string> {
    try {
      await this.providerService.createSlots(providerSlotDto);
      return 'Success';
    } catch (error) {
      console.error(error);
      throw new Error('Error creating slots');
    }
  }
}
