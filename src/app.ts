import './bootstrap';
import routes from './routes';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from './bootstrap/fastify';

try {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Dashboard API',
        description: 'Dashboard API Documentation',
        version: '0.1.0',
      },
    },
    transform: jsonSchemaTransform,
  });
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });

  fastify.after(() => routes.register(fastify));
  fastify.listen({ port: 3000, host: '0.0.0.0' }).then();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
