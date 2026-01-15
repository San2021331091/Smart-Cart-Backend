import { FastifyRequest, FastifyReply } from 'fastify';
import { CartItem } from '../models/CartItem.js';
import { AddToCartRequestBody } from '../types/CartItemTypes.js';
import { UserPayload } from '../types/UserpayloadTypes.js';

export const addToCart = async (
  request: FastifyRequest<{ Body: AddToCartRequestBody }>,
  reply: FastifyReply
) => {
  const { user_uid, product_id, img_url, quantity = 1, price } = request.body;
  if (!img_url || !price) return reply.code(400).send({ error: 'Missing required fields' });

  try {
    const item = await CartItem.create({ user_uid, product_id, img_url, quantity, price });
    return reply.send({ message: 'Item added to cart', item });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Could not add to cart' });
  }
};

export const deleteCartItems = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as UserPayload;
  if (!user.uid) return reply.status(400).send({ error: 'User ID missing from token' });

  try {
    const deletedCount = await CartItem.destroy({ where: { user_uid: user.uid } });
    return reply.send({ message: `🗑️ Deleted ${deletedCount} cart item(s)` });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to delete cart items' });
  }
};
