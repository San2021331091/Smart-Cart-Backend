import { FastifyInstance } from 'fastify';
import AdminJSFastify from '@adminjs/fastify';
import { adminJs } from '../admin/admin.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerAdminRoutes = async (app: FastifyInstance) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email: string, password: string) => {
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { email, role: 'admin' };
        }
        return null;
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET!,
    },
    app
  );
};
