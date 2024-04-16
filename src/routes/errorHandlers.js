const errorMessages = {
    PRODUCT_NOT_FOUND: 'El producto no se encontró.',
    INVALID_CART: 'El carrito es inválido.',
    MISSING_FIELDS: 'Faltan campos obligatorios para crear el producto.',
    // Agrega más errores según sea necesario...
  };
  
  // Manejador de Errores Personalizado
  const errorHandler = (err, req, res, next) => {
    // Determinar el mensaje de error basado en el tipo de error
    let errorMessage = 'Error interno del servidor'
    if (errorMessages[err.code]) {
      errorMessage = errorMessages[err.code]
    }
    
    // Enviar una respuesta de error al cliente
    res.status(err.status || 500).json({ error: errorMessage })
  }
  
  module.exports = { errorHandler, errorMessages }