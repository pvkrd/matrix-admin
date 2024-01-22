import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderServiceDocument = ProviderService & Document;

@Schema({ collection: 'provider_services' })
export class ProviderService {

    @Prop()
    serviceId: string;

    @Prop()
    displayName: string;
}

export const ProviderServiceSchema = SchemaFactory.createForClass(ProviderService);