import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { OrderConsumer } from './order.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    RabbitmqModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
})
export class OrdersModule {}
