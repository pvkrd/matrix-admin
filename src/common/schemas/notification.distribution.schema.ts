import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDistributionDocument = HydratedDocument<NotificationDistribution>;

export class Recipient{
    @Prop({required : true})
    name : string;
    @Prop({required : true})
    email : string;
    @Prop({required : true})
    phone : string;
    @Prop()
    token? : string;
}

@Schema({collection : 'distributionlist', timestamps : false})
export class NotificationDistribution {
    @Prop({required : true})
    distributionName : string;
    @Prop()
    enableEmailNotfication : boolean;
    @Prop()
    enablePhoneNotfication : boolean;
    @Prop()
    enablePushNotification : boolean;
    @Prop()
    contact : Recipient[]
}

export const NotificationDistributionSchema = SchemaFactory.createForClass(NotificationDistribution);