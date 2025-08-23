import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  name: string;
  @Prop()
  tel: string;
  @Prop()
  email: string;
  @Prop()
  idCard: string;
  @Prop()
  address: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Art' }],
    required: true,
  })
  orderArts: mongoose.Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
