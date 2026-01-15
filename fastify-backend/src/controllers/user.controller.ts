import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User.js';
import { UserPayload } from '../types/UserpayloadTypes.js';

export const getUserProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as UserPayload;
  if (!user?.uid) return reply.code(400).send({ error: 'User ID missing from token' });

  try {
    const userData = await User.findByPk(user.uid, {
      attributes: ['uid', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });
    if (!userData) return reply.code(404).send({ error: 'User not found' });

    return reply.send({ status: 'success', data: userData });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to fetch user profile' });
  }
};

