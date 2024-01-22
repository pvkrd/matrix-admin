import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

export type ProviderDocument = HydratedDocument<Provider>;

export class Address {
  @Prop()
  isOverride: boolean;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  startCity: string;

  @Prop()
  startState: string;

  @Prop()
  startStreet1: string;

  @Prop()
  startZip: string;
  @Prop()
  startStreet2: string; // Added

  @Prop()
  endCity: string; // Added

  @Prop()
  endCounty: string; // Added

  @Prop()
  endDate: Date; // Added

  @Prop()
  endState: string; // Added

  @Prop()
  endStreet1: string; // Added

  @Prop()
  endStreet2: string; // Added

  @Prop()
  endZip: string; // Added
}

export class Phone {
  @Prop()
  extension: string;

  @Prop()
  number: string;

  @Prop()
  numberType: string;
}

export class ContactInfo {
  @Prop()
  emailAddress: string;

  @Prop([Phone])
  phone: Phone[];
}

export class Profile {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  employmentStatusName: string;

  @Prop()
  employmentStartDate: Date;

  @Prop()
  employmentEndDate?: Date;
  @Prop([Address])
  address: Address[];

  @Prop()
  contactInfo: ContactInfo;
}

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

export class Location {
  @Prop()
  type: string;

  @Prop([Number])
  coordinates: number[];
}
export class WorkingZipcode {
  @Prop()
  SACState: string;
  @Prop()
  SACZipcode: string;
  @Prop()
  StatisticalAreaCode: number;
  @Prop()
  startDate: Date; // Added
  @Prop()
  endDate: Date; // Added
}
@Schema({ collection: 'providers' })
export class Provider {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  staffResourceId: number;
  @Prop()
  providerId: string;

  @Prop()
  createdAt: Date; // Added

  @Prop()
  updatedAt: Date; // Added

  @Prop()
  role: string;

  @Prop()
  employmentStatusId: number;
  @Prop()
  employmentEndDate?: string;

  @Prop()
  profile: Profile;

  @Prop()
  fullTime: boolean;

  @Prop([Msa])
  msa: Msa[];

  @Prop([Client])
  clients: Client[];

  @Prop([Program])
  programs: Program[];

  @Prop([WorkingZipcode])
  workingZipcodes: WorkingZipcode[];

  @Prop([String])
  attributes: string[];

  @Prop([String])
  products: string[];

  @Prop()
  fileName: string;

  @Prop()
  calendarId: string;

  @Prop()
  disabled: boolean;

  @Prop()
  location: Location;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
