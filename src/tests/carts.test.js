const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const expect = chai.expect
chai.use(chaiHttp)

describe('Carts API', () => {
  describe('GET /api/carts/:userId', () => {
    it('Debería obtener el carrito del usuario', (done) => {
      const userId = 1
      chai.request(app)
        .get(`/api/carts/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })

  describe('POST /api/carts/:userId', () => {
    it('Debería agregar un producto al carrito del usuario', (done) => {
      const userId = 1
      const cartItem = {
        productId: 1,
        quantity: 2
      };
      chai.request(app)
        .post(`/api/carts/${userId}`)
        .send(cartItem)
        .end((err, res) => {
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('productId', cartItem.productId)
          done()
        })
    })
  })
})