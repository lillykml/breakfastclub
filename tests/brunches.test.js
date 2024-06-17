// const { test, after, beforeEach, describe } = require('node:test')
// const assert = require('node:assert')
// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const Brunch = require('../models/brunch')
// const User = require('../models/user')

// const api = supertest(app)

// const initialBrunches = [
//     {
//         "datetime": "2024-07-14T08:30:00.000Z",
//         "locationName": "Another super new Brunch Spot",
//         "address": "Neureutherstrasse 1",
//         "spots": 6,
//     }, 
//     {
//         "datetime": "2024-07-23T08:30:00.000Z",
//         "locationName": "Cafe Conté",
//         "address": "Ainmillerstraße 1",
//         "spots": 8,
//     }
// ]

// beforeEach(async() => {
//     await Brunch.deleteMany({})
//     const brunchObjects = initialBrunches.map(brunch => new Brunch(brunch))
//     const promiseArray = brunchObjects.map(brunch => brunch.save())
//     await Promise.all(promiseArray)
// })

// describe('Retrieving brunches correctly', () => {

//     test('brunches are returned as json', async () => {
//         await api
//           .get('/api/brunches')
//           .expect(200)
//           .expect('Content-Type', /application\/json/) // using Regex
//       })

//       test('Correct number of brunches is returned', async () => {
//         const response = await api.get('/api/brunches')
//         assert.strictEqual(response.data.length === initialBrunches.length)
//       })
// })


//   after(async () => {
//     await mongoose.connection.close()
//   })