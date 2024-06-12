const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const brunchRouter = require('./controllers/brunches')
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
app.use('/api/brunches', brunchRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app