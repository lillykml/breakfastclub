const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const { generateId } = require('./utils/helpers');


let brunches = [
    {
      "id": 1,
      "date": "21.07.2024",
      "time": "10:30",
      "location": "Emmis Kitchen",
      "attendees": 4,
      "spots": 8
    },
    {
      "id": 2,
      "date": "21.07.2024",
      "time": "10:30",
      "location": "Trachtenvogel",
      "attendees": 4,
      "spots": 8
    },
    {
      "id": 3,
      "date": "21.07.2024",
      "time": "10:30",
      "location": "Wimmer Bäcker",
      "attendees": 4,
      "spots": 8
    }
]

app.get('/', (request, response) => {
    response.json({message: 'Use the endpoint /api/brunches'})
  })

app.get('/api/brunches', (request, response) => {
    response.json(brunches)
})

app.get('/api/brunches/:id', (request, response) => {
    const brunch = brunches.find(brunch => brunch.id === request.params.id)
    if (brunch) {
        response.json(brunch)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/brunches/:id', (request, response) => {
    const id = Number(request.params.id)
    brunches = brunches.filter(brunch => brunch.id !== id)
    response.status(204).end()
})


app.post('/api/brunches', (request, response) => {
const body = request.body

if (!body.date || !body.time || !body.location || !body.spots) {
    return response.status(400).json({ 
    error: 'content missing' 
    })
}

const brunch = {
    date: body.date,
    time: body.time,
    location: body.location,
    spots: body.spots,
    attendees: body.attendees,
    id: generateId(brunches),
}

brunches = brunches.concat(brunch)

response.json(brunch)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})