require('dotenv').config()

const config = {
  mongoUrl: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SECRET_KEY:process.env.SECRET_KEY,
  jwtSecret: process.env.JWT_SECRET || 'pass1991',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  port: process.env.PORT || 8080, // Puerto predeterminado 3000 si no se especifica en .env
}

module.exports = config