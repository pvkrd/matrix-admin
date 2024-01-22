import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from './schemas/provider.schema';
import { LoggingModule } from '../common/logging/logging.module';
import {
  ProviderLookup,
  ProviderLookupSchema,
} from './schemas/providerlookup.schema';

import {
  ProviderSlot,
  ProviderSlotSchema,
} from './schemas/providerslot.schema';
@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [
    LoggingModule,
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: ProviderLookup.name, schema: ProviderLookupSchema },
      { name: ProviderSlot.name, schema: ProviderSlotSchema },
    ]),
  ],
  exports: [ProvidersService],
})
export class ProvidersModule {}
