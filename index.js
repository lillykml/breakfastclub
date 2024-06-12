const express = require('express')
const app = express()

const brunches = [
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



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})