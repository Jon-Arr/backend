const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos',
      version: '1.0.0',
      description: 'Documentación de la API de Productos',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./*.js'], // Ruta a tus archivos con definiciones de rutas
}

const specs = swaggerJSDoc(options)

module.exports = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
}
