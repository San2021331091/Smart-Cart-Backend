import { FastifyInstance } from 'fastify';
import { addToCart, deleteCartItems } from '../controllers/cart.controller.js';

export const cartRoutes = async (app: FastifyInstance) => {
  app.post('/add_cart', addToCart);
  app.delete('/cart_items', { preValidation: [app.authenticate] }, deleteCartItems);
};
