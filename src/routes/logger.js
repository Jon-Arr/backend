const winston = require('winston')

const devLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
})

const prodLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger

module.exports = logger