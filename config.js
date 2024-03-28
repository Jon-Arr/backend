require('dotenv').config()

const config = {
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 8080, // Puerto predeterminado 3000 si no se especifica en .env
}

module.exports = config