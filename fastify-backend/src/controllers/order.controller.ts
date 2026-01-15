import { FastifyRequest, FastifyReply } from 'fastify';
import { Order } from '../models/Order.js';
import { OrderRequestBody } from '../types/OrderRequestTypes.js';

export const createOrders = async (
  request: FastifyRequest<{ Body: OrderRequestBody }>,
  reply: FastifyReply
) => {
  const user = request.user;
  if (!user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  const { items, total } = request.body;
  if (!Array.isArray(items) || items.length === 0 || !total) {
    return reply.code(400).send({ error: 'Missing required fields: items or total' });
  }

  try {
    const createdOrders = await Promise.all(
      items.map(async (item) => {
        const { productId, img_url, quantity, price } = item;

        return await Order.create({
          user_uid: user.uid,
          product_id: parseInt(productId),
          img_url,
          quantity,
          price,
          ordered_at: new Date(),
          status: 'pending',
        });
      })
    );

    return reply.code(201).send({ message: '✅ Order placed successfully', orders: createdOrders });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to place order' });
  }
};
