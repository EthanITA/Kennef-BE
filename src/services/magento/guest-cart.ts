import Magento from './index';
import { Cart } from '../../types/cart';

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
}

export default GuestCart;
