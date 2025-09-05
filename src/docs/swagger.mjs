import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patitas al Rescate – API',
      version: '1.0.0',
      description: 'Backend Node.js + Express para gestión de refugios y adopciones 🐾',
      contact: { name: 'Tu nombre', email: 'tu@email.com' }
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }]
  },
  apis: ['./src/routes/*.mjs', './src/models/*.mjs']
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};