require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const { generateId } = require('./utils/helpers');
app.use(express.static('dist'))
const Brunch = require('./models/brunch')


app.get('/', (request, response) => {
    response.json({message: 'Use the endpoint /api/brunches'})
  })

app.get('/api/brunches', async (request, response) => {
    const brunches = await Brunch.find({})
    response.json(brunches)
})

app.get('/api/brunches/:id', async (request, response) => {

    const brunch = await Brunch.findById(request.params.id)
    if (brunch) {
        response.json(brunch)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/brunches/:id', async (request, response) => {
    await Brunch.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


app.post('/api/brunches', async (request, response) => {

    const body = request.body

    const brunch = new Brunch({
    datetime: body.datetime,
    locationName: body.location,
    address: body.address,
    spots: body.spots
    })

    const newBrunch = await brunch.save()
    response.status(201).json(newBrunch)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})