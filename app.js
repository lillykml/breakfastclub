const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')
const brunchRouter = require('./controllers/brunches')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


const app = express()
app.use(express.json())
app.use(cors())

// DB Connection
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI
logger.info('connecting to', url)
mongoose.connect(url)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(middleware.tokenExtractor)
app.use('/api/brunches', brunchRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app