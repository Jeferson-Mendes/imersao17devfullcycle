import { Injectable } from '@nestjs/common';
import { OrderStatus } from './entities/order.entity';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { OrdersService } from './orders.service';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class OrderConsumer {
  constructor(
    private orderService: OrdersService,
    private amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PaymentDone',
    queue: 'payments',
  })
  async consume(msg: { order_id: string; status: OrderStatus }) {
    try {
      switch (msg.status) {
        case OrderStatus.PAID:
          await this.orderService.pay(msg.order_id);
          break;
        case OrderStatus.FAILED:
          await this.orderService.fail(msg.order_id);
          break;
        default:
          throw new InvalidStatusError('Invalid status');
      }
      if (msg.status === 'paid') {
      }
    } catch (e) {
      if (e instanceof EntityNotFoundError || e instanceof InvalidStatusError) {
        await this.amqpConnection.publish('amq.direct', 'fail', {
          error: e.message,
          order_id: msg.order_id,
        });
        return new Nack(false);
      }
      //logica para contar quantas vezes uma mensagem foi consumida
      return new Nack(true);
    }
  }
}

class InvalidStatusError extends Error {
  constructor(invalidStatus: string) {
    super(`Invalid status: ${invalidStatus}`);
  }
}
