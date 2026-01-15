import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { createOrders } from '../controllers/order.controller.js';
import { OrderRequestBody } from '../types/OrderRequestTypes.js';

export const orderRoutes = async (app: FastifyInstance) => {
  const opts: RouteShorthandOptions = {
    preValidation: [async (request, reply) => await app.authenticate(request, reply)],
  };

  app.post<{ Body: OrderRequestBody }>('/orders', opts, createOrders);
};

