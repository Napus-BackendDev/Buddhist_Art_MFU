import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Art } from "src/module/arts/schema/art.schema";

export type PreOrderDocument = HydratedDocument<PreOrder>;

@Schema({ timestamps: true })
export class PreOrder {
    @Prop ({ required: true })
    name: string;
    @Prop ({ required: true })
    phone: string;
    @Prop ({ required: true })
    email: string;
    @Prop ()
    idCard: string;  // รอเขียน Encrypt 
    @Prop ({ required: true })
    address: string;
    @Prop ({ type: [{ type: Types.ObjectId, ref: 'Art' }], required: true })
    orderArts: Types.ObjectId[] | Art[];
}

export const PreOrderSchema = SchemaFactory.createForClass(PreOrder);
