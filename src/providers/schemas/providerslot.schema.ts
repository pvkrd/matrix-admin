import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderSlotDocument = ProviderSlot & Document;

export class Msa {
  @Prop()
  isPrimary: boolean;

  @Prop()
  license: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  state: string;
}

export class Client {
  @Prop()
  clientId: number;

  @Prop()
  clientName: string;

  @Prop()
  endDate: Date;

  @Prop()
  startDate: Date;
}

export class Program {
  @Prop()
  name: string;

  @Prop()
  programId: number;

  @Prop()
  endDate: Date;

  @Prop()
  startDate: Date;
}
@Schema({ collection: 'provider_slots' })
export class ProviderSlot {
  @Prop()
  providerId: string;

  @Prop()
  date: Date;

  @Prop([Msa])
  msa: Msa[];

  @Prop([Client])
  clients: Client[];

  @Prop([Program])
  programs: Program[];

  @Prop()
  products: string[];

  @Prop()
  duration: string;

  @Prop()
  slotTime: Date;

  @Prop()
  slotEndTime: Date;

  @Prop()
  startDateTime: Date;

  @Prop()
  endDateTime: Date;

  @Prop()
  timeZone: string;

  @Prop()
  status: string;

  @Prop()
  changed: string;

  @Prop()
  reasonId: number;
  @Prop()
  staffResourceId: number;

  @Prop()
  isWorking: boolean;

  @Prop()
  serviceId: string;

  @Prop()
  toBeExtracted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  serviceNotes: string;

  @Prop()
  email: string;

  @Prop()
  firstName: string;
  @Prop()
  lastName: string;

  @Prop()
  providerName: string;
}

export const ProviderSlotSchema = SchemaFactory.createForClass(ProviderSlot);
