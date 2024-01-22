import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

// Define a type for ProviderDocument which is a hydrated document of ProviderLookupSchema
export type ProviderLookupDocument = HydratedDocument<ProviderLookup>;
export class Location {
  @Prop()
  type: string;

  @Prop([Number])
  coordinates: number[];
}
@Schema({ collection: 'providers_lookup', timestamps: true })
export class ProviderLookup {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  emailAddress: string;
  @Prop()
  calendarId: string;

  @Prop()
  staffMemberId: string;
  @Prop()
  providerId: string;
  @Prop()
  @Prop()
  location: Location;
  @Prop()
  staffResourceId: number;
}

// Create a schema for the ProviderLookupSchema class
export const ProviderLookupSchema = SchemaFactory.createForClass(ProviderLookup);