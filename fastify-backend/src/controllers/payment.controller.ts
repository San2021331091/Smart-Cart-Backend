import { FastifyRequest, FastifyReply } from 'fastify';
import { Payment } from '../models/Payment.js';
import { UserPayload } from '../types/UserpayloadTypes.js';
import { PaymentIntentRequestBody } from '../types/PaymentIntent.js';

export const getAllPayments = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const payments = await Payment.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['cvv', 'card_number', 'expiry'] },
    });
    return reply.send({ status: 'success', data: payments });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ status: 'error', message: 'Failed to fetch payments' });
  }
};

export const getUserPayments = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as UserPayload;
  if (!user?.email) return reply.code(400).send({ error: 'Email not found in token' });

  try {
    const payments = await Payment.findAll({
      where: { email: user.email },
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['cvv', 'card_number'] },
    });
    return reply.send({ status: 'success', count: payments.length, data: payments });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to fetch payments' });
  }
};

export const createPaymentIntent = async (
  request: FastifyRequest<{ Body: PaymentIntentRequestBody }>,
  reply: FastifyReply
) => {
  let { amount, card_type, card_number, expiry, cvv, email, username } = request.body;
  if (typeof amount === 'string') amount = Math.round(Number(amount));

  if (!amount || isNaN(amount)) return reply.code(400).send({ error: 'Invalid amount' });
  if (!card_type || !['visa', 'mastercard'].includes(card_type)) return reply.code(400).send({ error: 'Invalid card_type' });
  if (!card_number || !expiry || !cvv) return reply.code(400).send({ error: 'Missing card details' });

  try {
    const recent = await Payment.findOne({
      where: { amount, card_type, expiry, email, username, status: 'success' },
      order: [['created_at', 'DESC']],
    });

    if (recent && recent.created_at && new Date(recent.created_at).getTime() > Date.now() - 2 * 60 * 1000) {
      return reply.send({ message: '⚠️ Duplicate payment ignored', paymentId: recent.id });
    }

    const payment = await Payment.create({ amount, card_type, card_number, expiry, cvv, email, username, status: 'success' });
    return reply.send({ message: '✅ Payment processed successfully', paymentId: payment.id });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to process payment' });
  }
};
