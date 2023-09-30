import * as PP from 'paypal-rest-sdk';
import { Amount, Payment, PaymentResponse, Transaction } from 'paypal-rest-sdk';
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

  static async getPaymentResponse(
    item_list: Transaction['item_list'],
    amount: Amount,
    redirect_urls: Payment['redirect_urls'],
  ): Promise<string | undefined | never> {
    const paypal = new this();
    const payment = paypal.createPayment(item_list, amount, redirect_urls);
    const paymentResponse = await paypal.createSession(payment).catch((err) => {
      fastify.log.error(err);
      return undefined;
    });
    if (!paymentResponse) return undefined;
    return paypal.getLink(paymentResponse);
  }

  // Function to create PayPal payment
  createPayment(item_list: Transaction['item_list'], amount: Amount, redirect_urls: Payment['redirect_urls']): Payment {
    return {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount,
          item_list,
        },
      ],
      redirect_urls,
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
