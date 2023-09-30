import { Cart } from '../../types/cart';
import PayableCart from './payable-cart';

class GuestCart extends PayableCart {
  constructor(cartId: Cart['id']) {
    super(cartId, true);
  }
}

export default GuestCart;
