import { Cart, CartTotal } from '../../types/cart';
import { Amount, Payment, PaymentResponse, Transaction } from 'paypal-rest-sdk';
import fastify from '../../bootstrap/fastify';
import PayPal from '../PayPal';
import Magento from './index';
import Order from './order';

export default class PayableCart extends Magento {
  public cart?: Cart;
  public readonly cartId: string;
  public readonly isGuest: boolean;

  constructor(cartId: string, isGuest: boolean) {
    super(isGuest ? 'guest-carts' : 'carts');
    this.cartId = cartId;
    this.isGuest = isGuest;
  }

  public static async verifyPayment(payment?: PaymentResponse): Promise<PayableCart | undefined> {
    try {
      if (!payment) return;
      if (payment.state !== 'approved') return;
      if (payment.transactions.length !== 1) return;
      const transaction = payment.transactions[0];
      if (!transaction.custom) return;
      const { cartId, isGuest } = JSON.parse(transaction.custom) as { cartId: string; isGuest: boolean };
      const cart = new PayableCart(cartId, isGuest);
      const cartTotal = await cart.getTotal();
      if (!cartTotal) return;
      const amount = transaction.amount.total;
      const total = cartTotal.grand_total.toFixed(2);
      const approved = amount === total;
      if (!approved) return;
      fastify.log.info(`PayPal payment for ${cartId} approved`);
      return cart;
    } catch (e) {
      fastify.log.error(e);
      return;
    }
  }

  async getCart(): Promise<Cart | undefined> {
    return this.axios
      .get<Cart>(this.cartId)
      .then((res) => (this.cart = res.data))
      .catch(() => (this.cart = undefined));
  }

  async getTotal(): Promise<CartTotal | undefined> {
    return this.axios
      .get<CartTotal>(`${this.cartId}/totals`)
      .then((res) => res.data)
      .catch(() => undefined);
  }

  async getPaymentLink(redirects: Payment['redirect_urls']): Promise<string | undefined> {
    const [cart, total] = await Promise.all([this.getCart(), this.getTotal()]);
    if (!cart || !total) return undefined;

    const shippingAddress = cart?.extension_attributes.shipping_assignments?.[0].shipping.address ?? cart.billing_address;
    const ppItemList: Transaction['item_list'] = {
      shipping_address: {
        recipient_name: `${shippingAddress.firstname} ${shippingAddress.lastname}`,
        phone: shippingAddress.telephone ?? '',
        city: shippingAddress.city ?? '',
        line1: shippingAddress.street.join(' '),
        country_code: shippingAddress.country_id ?? '',
        state: shippingAddress.region ?? '',
        postal_code: shippingAddress.postcode ?? '',
      },
      items: cart.items.map((item) => ({
        currency: total.base_currency_code,
        name: item.name,
        price: item.price.toFixed(2),
        quantity: item.qty,
        sku: item.sku,
      })),
    };
    fastify.log.debug(`PayPal item_list: ${JSON.stringify(ppItemList)}`);
    const ppAmount: Amount = {
      currency: total.base_currency_code,
      total: total.grand_total.toFixed(2),
      details: {
        subtotal: total.subtotal.toFixed(2),
        shipping: total.shipping_amount.toFixed(2),
      },
    };
    const paymentLink = await PayPal.getPaymentResponse(
      ppItemList,
      ppAmount,
      redirects,
      JSON.stringify({
        cartId: this.cartId,
        isGuest: this.isGuest,
      }),
    );
    fastify.log.info(`PayPal link for ${this.cartId} --> ${paymentLink}`);
    return paymentLink;
  }

  public async createOrder(): Promise<Order | undefined> {
    await this.axios
      .put(`${this.cartId}/selected-payment-method`, {
        method: { method: 'banktransfer' },
      })
      .catch();
    return this.axios
      .put<string>(`${this.cartId}/order`)
      .then((res) => new Order(res.data))
      .catch();
  }
}
