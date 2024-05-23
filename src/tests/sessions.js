const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Sessions API', () => {
  let userCredentials = {
    first_name: 'Jon',
    last_name: 'Arr',
    email: 'jaarriaza.e@gmail.com',
    age: 33,
    password: 'password123'
  };

  let userCredentialsLogin = {
    email: 'jaarriaza.e@gmail.com',
    password: 'password123'
  }

  let token

  // Registro de usuario
  describe('POST /api/sessions/register', () => {
    it('Debería registrar un nuevo usuario', (done) => {
      chai.request(app)
        .post('/api/sessions/register')
        .send(userCredentials)
        .end((err, res) => {
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message').eql('User registered successfully')
          done()
        })
    })
  })

  // Login de usuario
  describe('POST /api/sessions/login', () => {
    it('Debería iniciar sesión y devolver un token', (done) => {
      chai.request(app)
        .post('/api/sessions/login')
        .send(userCredentialsLogin)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('token')
          token = res.body.token
          done()
        })
    })
  })

  // Ruta para obtener el usuario actual
  describe('GET /api/sessions/current', () => {
    it('Debería devolver el usuario actual', (done) => {
      chai.request(app)
        .get('/api/sessions/current')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('email').eql(userCredentials.email)
          done()
        })
    })
  })
})