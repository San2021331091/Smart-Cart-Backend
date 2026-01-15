import { FastifyInstance } from 'fastify';
import { getAllPayments, getUserPayments, createPaymentIntent } from '../controllers/payment.controller.js';

export const paymentRoutes = async (app: FastifyInstance) => {
  app.get('/payments', getAllPayments);
  app.get('/payments/user', { preValidation: [app.authenticate] }, getUserPayments);
  app.post('/create-payment-intent', createPaymentIntent);
};
