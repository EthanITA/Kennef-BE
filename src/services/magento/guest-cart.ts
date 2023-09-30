import Magento from './index';
import { Cart, CartTotal } from '../../types/cart';

class GuestCart extends Magento {
  private cartId: Cart['id'];
  public cart?: Cart;

  constructor(cartId: Cart['id']) {
    super();
    this.cartId = cartId;
  }

  async getCart(): Promise<Cart | undefined> {
    return this.axios
      .get<Cart>(`guest-carts/${this.cartId}`)
      .then((res) => (this.cart = res.data))
      .catch(() => (this.cart = undefined));
  }

  async getTotal(): Promise<CartTotal | undefined> {
    return this.axios
      .get<CartTotal>(`guest-carts/${this.cartId}/totals`)
      .then((res) => res.data)
      .catch(() => undefined);
  }
}

export default GuestCart;
