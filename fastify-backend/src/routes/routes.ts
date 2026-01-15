import { FastifyInstance } from 'fastify';
import { orderRoutes } from './order.routes.js';
import { cartRoutes } from './cart.routes.js';
import { paymentRoutes } from './payment.routes.js';
import { userRoutes } from './user.routes.js';

export const registerRoutes = async (app: FastifyInstance) => {
  await orderRoutes(app);
  await cartRoutes(app);
  await paymentRoutes(app);
  await userRoutes(app);  
};
