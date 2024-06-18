const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Brunch = require('../models/brunch')
const User = require('../models/user')
const helpers = require('./testhelpers')

const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})
    const userData = await helpers.getInitialUser()
    const user = new User(userData)
    await user.save()
    const token = await helpers.getUserToken({ id: user._id, username: user.username })
    global.testToken = token
    const brunches = await helpers.getInitialBrunches(user._id)

    await Brunch.deleteMany({})
    const brunchObjects = brunches.map(brunch => new Brunch(brunch))
    const promiseArray = brunchObjects.map(brunch => brunch.save())
    await Promise.all(promiseArray)
})

describe('Retrieving brunches correctly', async () => {

    test('brunches are returned as json', async () => {
        const response = await api.get('/api/brunches')
        .expect(200)
        .expect('Content-Type', /application\/json/) // using Regex
      })

    test('Correct number of brunches is returned', async () => {
        const response = await api.get('/api/brunches')
        assert.strictEqual(response.body.length, helpers.initialBrunches.length)
      })
})

describe('Adding a new brunch', async () => {

    test('Adding a new brunch works correctly', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "datetime": "2024-07-14T08:30:00.000Z",
            "location": "Another super new Brunch Spot",
            "address": "Neureutherstrasse 1",
            "spots": 6
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length-1)
    })

    test('Adding a new brunch without datetime fails', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "location": "Another super new Brunch Spot",
            "address": "Neureutherstrasse 1",
            "spots": 6
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(400)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length)
    })

    test('Adding a new brunch with invalid datetime fails', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "datetime": "2024-07-14sdf",
            "location": "Another super new Brunch Spot",
            "address": "Neureutherstrasse 1",
            "spots": 6
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(400)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length)
    })

    test('Adding a new brunch without location fails', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "datetime": "2024-07-14T08:30:00.000Z",
            "address": "Neureutherstrasse 1",
            "spots": 6
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(400)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length)
    })

    test('Adding a new brunch without address fails', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "datetime": "2024-07-14T08:30:00.000Z",
            "location": "Another super new Brunch Spot",
            "spots": 6
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(400)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length)
    })

    test('Adding a new brunch without spots fails', async () => {

        const brunchesAtStart = await helpers.brunchesInDb()

        const newBrunch = {
            "datetime": "2024-07-14T08:30:00.000Z",
            "location": "Another super new Brunch Spot",
            "address": "Neureutherstrasse 1"
        }

        await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(400)

        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length, brunchesAtEnd.length)
    })
})

describe('Deleting a brunch', async () => {
    test.only('Deleting a brunch removes the brunch', async () => {
        const brunchesAtStart = await helpers.brunchesInDb()
        const idToDelete = brunchesAtStart[0].id
        
        await api.delete(`/api/brunches/${idToDelete}`)
        const brunchesAtEnd = await helpers.brunchesInDb()
        assert.strictEqual(brunchesAtStart.length-1, brunchesAtEnd.length)

        const organizerID = brunchesAtStart[0].organizer
        const organizer = await User.findOne({_id: organizerID})
        console.log(organizer)
    })

    test.only('Deleting a brunch removes the brunch from the organizer', async () => {

        const newBrunch = {
            "datetime": "2024-07-14T08:30:00.000Z",
            "location": "Another super new Brunch Spot",
            "address": "Neureutherstrasse 1",
            "spots": 6
        }

        const createdBrunch = await api
        .post('/api/brunches')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBrunch)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const idToDelete = createdBrunch.body.id
        
        await api.delete(`/api/brunches/${idToDelete}`)

        const organizerID = createdBrunch.body.organizer
        const organizer = await User.findOne({_id: organizerID})
        assert(!organizer.organizedBrunches.includes(idToDelete))
        assert(!organizer.brunches.includes(idToDelete))
    })
})

  after(async () => {
    await mongoose.connection.close()
  })