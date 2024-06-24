const generateMockProducts = () => {
    const mockProducts = []
    for (let i = 0; i < 100; i++) {
      const product = {
        _id: `product_${i + 1}`,
        title: `Product ${i + 1}`,
        description: `Description for Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 1, // Precio aleatorio entre 1 y 100
        thumbnail: `thumbnail_${i + 1}.jpg`,
        code: `CODE${i + 1}`,
        stock: Math.floor(Math.random() * 100) + 1, // Stock aleatorio entre 1 y 100
      }
      mockProducts.push(product)
    }
    return mockProducts
  }
  
  // Middleware para el endpoint "/mockingproducts"
  const mockingMiddleware = (req, res, next) => {
    if (req.url === '/mockingproducts' && req.method === 'GET') {
      // Generar los productos de ejemplo
      const mockProducts = generateMockProducts()
      // Enviar los productos como respuesta
      res.json(mockProducts)
    } else {
      // Si la URL no es "/mockingproducts" o no es un método GET, pasar al siguiente middleware
      next()
    }
  }
  
  module.exports = mockingMiddleware