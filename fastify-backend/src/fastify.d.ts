import 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserPayload } from './UserpayloadTypes.js'; 

declare module 'fastify' {
  interface FastifyInstance {
    // the authenticate decorator function
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    // user exists after authentication
    user?: UserPayload;
  }
}
