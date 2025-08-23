import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductStatus } from 'src/common/types/types';

export type ArtDocument = HydratedDocument<Art>;

@Schema({ timestamps: true, versionKey: false, id: false })
export class Art {
  @Prop()
  picture: string;
  @Prop()
  artId: string;
  @Prop()
  artname: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
  @Prop()
  size: string;
  @Prop()
  technique: string;
  @Prop()
  price: string;
  @Prop()
  concept: string;
  @Prop()
  type: string;
  @Prop()
  presentation: string;
  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.AVAILABLE })
  status: ProductStatus;
  @Prop()
  artAddress: string;
  @Prop()
  ratio: string;
}

export const ArtSchema = SchemaFactory.createForClass(Art);

ArtSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'orderArts',
});

ArtSchema.set('toJSON', { virtuals: true });
ArtSchema.set('toObject', { virtuals: true });
