import Magento from './index';

class Order extends Magento {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  async invoice(): Promise<boolean> {
    return this.axios
      .post<boolean>(`order/${this.id}/invoice`)
      .then(() => true)
      .catch(() => false);
  }
}

export default Order;
