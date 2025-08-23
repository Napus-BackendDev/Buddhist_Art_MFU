import { Module } from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { PreOrderController } from './pre-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreOrder, PreOrderSchema } from './schema/pre-order.schema';
import { Art, ArtSchema } from '../arts/schema/art.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PreOrder.name, schema: PreOrderSchema },
      { name: Art.name, schema: ArtSchema }
    ])
  ],
  controllers: [PreOrderController],
  providers: [PreOrderService],
})
export class PreOrderModule {}
