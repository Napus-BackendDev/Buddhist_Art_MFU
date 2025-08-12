import { Injectable } from '@nestjs/common';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { UpdatePreOrderDto } from './dto/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PreOrder, PreOrderDocument } from './schema/pre-order.schema';
import { Model } from 'mongoose';

@Injectable()
export class PreOrderService {
  constructor(@InjectModel(PreOrder.name) private PreOrderModel: Model<PreOrderDocument>) {}

  async create(createPreOrderDto: CreatePreOrderDto) : Promise<PreOrder> {
    const preOrder = new this.PreOrderModel(createPreOrderDto);
    return await preOrder.save();
  }

  async findAll() : Promise<PreOrder[]> {
    return await this.PreOrderModel.find().populate('orderArts').exec();
  }

  async findOne(id: string) : Promise<PreOrder | null> {
    return await this.PreOrderModel.findById(id).populate('orderArts').exec();
  }

  async update(id: string, updatePreOrderDto: UpdatePreOrderDto) : Promise<PreOrder | null> {
    return await this.PreOrderModel.findByIdAndUpdate(id, updatePreOrderDto, { new: true }).exec();
  }

  async remove(id: string) : Promise<PreOrder | null> {
    return await this.PreOrderModel.findByIdAndDelete(id).exec();
  }
}
