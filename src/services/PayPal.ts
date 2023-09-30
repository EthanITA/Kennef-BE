import * as PP from 'paypal-rest-sdk';
import { Item, Payment, PaymentResponse } from 'paypal-rest-sdk';
import { sum, toNumber } from 'lodash';
import fastify from '../bootstrap/fastify';

type Currency = 'EUR' | string;

PP.configure({
  mode: process.env.NODE_ENV === 'development' ? 'sandbox' : 'live',
  client_id: process.env.PP_CLIENT_ID,
  client_secret: process.env.PP_SECRET_KEY,
});

class PayPal {
  currency: Currency;

  constructor() {
    this.currency = 'EUR';
  }

  static async getPaymentResponse(items: Item[]): Promise<string | undefined | never> {
    const paypal = new this();
    const payment = paypal.createPayment(items);
    const paymentResponse = await paypal.createSession(payment).catch((err) => {
      fastify.log.error(err);
      return undefined;
    });
    if (!paymentResponse) return undefined;
    return paypal.getLink(paymentResponse);
  }

  // Function to create PayPal payment
  createPayment(items: Item[]): Payment {
    const totalAmount = sum(items.map((item) => toNumber(item.price)));

    return {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: totalAmount.toFixed(2),
            currency: this.currency,
          },
          item_list: {
            items,
          },
        },
      ],
      redirect_urls: {
        return_url: `${process.env.APP_URL}`,
        cancel_url: `${process.env.APP_URL}`,
      },
    };
  }

  // Function to create PayPal session
  createSession(payment: Payment): Promise<PaymentResponse | never> {
    return new Promise<PaymentResponse>((resolve, reject) => PP.payment.create(payment, (err, res) => (err ? reject(err) : resolve(res))));
  }

  getLink(paymentResponse: PaymentResponse): string | undefined {
    return paymentResponse.links?.find?.((link) => link.rel === 'approval_url')?.href;
  }
}

export default PayPal;
