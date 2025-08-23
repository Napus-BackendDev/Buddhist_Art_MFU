import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    return await new this.orderModel(createOrderDto).save() ;
  }

  async findAll(): Promise<OrderDocument[]> {
    return await this.orderModel.find().populate('orderArts').exec();
  }

  async findByName(name: string): Promise<OrderDocument | null> {
    return await this.orderModel.findOne({ name }).populate('orderArts').exec() ;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDocument | null> {
    return await this.orderModel.findByIdAndUpdate(id,updateOrderDto, { new: true });
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
