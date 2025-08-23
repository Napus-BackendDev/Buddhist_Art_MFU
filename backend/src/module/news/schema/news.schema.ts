import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema({ versionKey: false, timestamps: true })
export class News {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  image: string;
  @Prop()
  place: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
