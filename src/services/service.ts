import fastify from '../bootstrap/fastify';
import axios, { AxiosInstance } from 'axios';

export class Service {
  axios: AxiosInstance;

  constructor(baseURL: string, context: string = 'ANONYMOUS SERVICE') {
    this.axios = axios.create({
      baseURL,
    });
    this.axios.interceptors.response.use((response) => {
      const msg = `[${context}] ${response.status} <-- ${(response.config.method || '').toUpperCase()} ${response.config.url}`;
      if (response.status >= 500) fastify.log.error(msg);
      else if (response.status >= 400) fastify.log.warn(msg);
      else fastify.log.debug(msg);
      return response;
    });
  }
}
