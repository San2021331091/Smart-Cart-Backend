import { FastifyInstance } from 'fastify';
import { getUserProfile } from '../controllers/user.controller.js';

export const userRoutes = async (app: FastifyInstance) => {
  // Requires JWT authentication
  app.get('/profile', { preValidation: [app.authenticate] }, getUserProfile);
 
};
