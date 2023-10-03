import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';
import { RouteOptions } from 'fastify/types/route';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import payments from './payments';

type RoutePrefix = string;
type FastifyZod = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

const routes: Record<RoutePrefix, RouteOptions[]> = {
  payments,
};

export default {
  register: (fastify: FastifyZod) => {
    Object.entries(routes).forEach(([prefix, routes]) =>
      fastify.register(
        (fastify, _opts, done) => {
          routes.forEach((route) => {
            fastify.route(route);
            // fastify isn't automatically adding the OPTIONS route
            fastify.route({
              url: route.url,
              method: 'OPTIONS',
              handler: (_, reply) => reply.status(204).send(),
              schema: {
                hide: true, // hide from swagger
              },
            });
          });
          done();
        },
        { prefix },
      ),
    );
  },
};
