import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type ArtDocument = HydratedDocument<Art>

@Schema({timestamps: true})
export class Art {
    @Prop({ required: true})
    name: string
    @Prop({ required: true})
    image: string
    @Prop({ required: true})
    description: string
    @Prop({ required: true})
    category: string
    @Prop({ required: true})
    price: number
    @Prop({ required: true})
    style: string
    @Prop({ required: true})
    user: string
    @Prop({ required: true})
    size: string
}

export const ArtSchema = SchemaFactory.createForClass(Art)
