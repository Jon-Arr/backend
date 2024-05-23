const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const expect = chai.expect
chai.use(chaiHttp)

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('Debería obtener todos los productos', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done();
        });
    });
  });

  describe('POST /api/products', () => {
    it('Debería crear un nuevo producto', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        description: 'Descripción del producto de prueba',
        price: 100,
        thumbnail: '/producto.jpg',
        code: 'test123',
        stock: 10
      }
      chai.request(app)
        .post('/api/products')
        .send(newProduct)
        .end((err, res) => {
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('title', newProduct.title)
          done()
        })
    })
  })
})