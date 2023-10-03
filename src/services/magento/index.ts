import { Service } from '../service';

class Magento extends Service {
  constructor(subUrl: string = '') {
    super(`${process.env.MAGENTO_REST_URL}/${subUrl}`, `Magento - ${subUrl || 'root'}`);
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.MAGENTO_TOKEN}`;
    this.axios.defaults.headers.common['Content-Type'] = 'application/json';
  }
}

export default Magento;
