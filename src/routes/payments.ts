import { RouteOptions } from 'fastify/types/route';
import { z } from 'zod';
import GuestCart from '../services/magento/guest-cart';
import PayPal from '../services/PayPal';

export default [
  {
    method: 'POST',
    url: '/paypal',
    handler: async (
      request: {
        body: {
          userId?: string;
          cartId?: string;
        };
      },
      reply,
    ) => {
      const { userId, cartId } = request.body;
      if (!userId && !cartId) return reply.status(400).send('You must provide either a userId or a cartId');
      if (userId && cartId) return reply.status(400).send('You must provide either a userId or a cartId, not both');

      if (cartId) {
        const paymentLink = await new GuestCart(cartId).getPaymentLink({
          return_url: `${process.env.BE_URL}/payments/paypal/order-completed`,
          cancel_url: `${process.env.APP_URL}/cart`,
        });
        if (!paymentLink) return reply.status(500).send('Failed to create payment');
        return reply.status(200).send(paymentLink);
      }
    },
    schema: {
      body: z.object({
        userId: z.string().optional(),
        cartId: z.string().optional(),
      }),
      description: 'Create a PayPal payment from either userId or cartId, then return the payment link',
      tags: ['payments'],
      summary: 'Create a PayPal payment link',
      response: {
        200: z.undefined(),
        400: z.string(),
        404: z.string(),
        500: z.string(),
      },
    },
  },
  {
    method: 'GET',
    url: '/paypal/order-completed',
    handler: async (
      request: {
        query: {
          token: string;
          PayerID: string;
          paymentId: string;
        };
      },
      reply,
    ) => {
      const { token, PayerID, paymentId } = request.query;
      const payment = await PayPal.executePayment(paymentId, PayerID, token);
      if (await GuestCart.verifyPayment(payment)) {
        // create order
        return reply.redirect(`${process.env.APP_URL}/order-completed`);
      } else {
        return reply.redirect(`${process.env.APP_URL}/cart`);
      }
    },
    schema: {
      description: 'Handle the PayPal redirect after payment',
      tags: ['payments'],
      summary: 'Handle the PayPal redirect after payment',
      querystring: z.object({
        token: z.string(),
        PayerID: z.string(),
        paymentId: z.string(),
      }),
      response: {
        302: z.undefined(),
      },
    },
  },
] as RouteOptions[];
