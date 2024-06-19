import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({
  collection: "order",
  timestamps: true,
})
export class Order {
  @Prop()
  name: string;

  @Prop()
  userId: string;

  @Prop()
  destinationId: string;

  @Prop()
  receiveId: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
