import { Cart, CartTotal } from '../../types/cart';
import { Amount, Payment, Transaction } from 'paypal-rest-sdk';
import fastify from '../../bootstrap/fastify';
import PayPal from '../PayPal';
import Magento from './index';
import axios from 'axios';

export default class PayableCart extends Magento {
  private readonly cartId: string;
  public cart?: Cart;

  constructor(cartId: string, isGuest: boolean) {
    super();
    this.axios = axios.create({
      ...this.axios.defaults,
      baseURL: `${process.env.MAGENTO_REST_URL}/${isGuest ? 'guest-carts' : 'carts'}`,
    });
    this.cartId = cartId;
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
    const paymentLink = await PayPal.getPaymentResponse(ppItemList, ppAmount, redirects, this.cartId);
    fastify.log.info(`PayPal link for ${this.cartId} --> ${paymentLink}`);
    return paymentLink;
  }
}
