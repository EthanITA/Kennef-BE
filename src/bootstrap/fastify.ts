import Fastify, { HTTPMethods } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const isDev = process.env.NODE_ENV === 'development';
const fastify = Fastify({
  logger: {
    level: isDev ? 'debug' : 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:h:MM:ss.l',
        ignore: 'pid,hostname,req.remotePort,req.remoteAddress,req.hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

fastify.addHook('onRoute', (route) => {
  if (['HEAD', 'OPTIONS'].includes(route.method as HTTPMethods)) return;
  fastify.log.debug(`${route.method} ${route.url}`);
});

fastify.log.info(`Running in ${process.env.NODE_ENV ?? 'production'} mode`);

export default fastify;
