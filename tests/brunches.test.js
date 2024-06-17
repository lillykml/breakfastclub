const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Brunch = require('../models/brunch')
const User = require('../models/user')
const helpers = require('./testhelpers')

const api = supertest(app)

describe('Retrieving brunches correctly', async () => {

    beforeEach(async() => {
        await User.deleteMany({})
        const userObject = new User(await helpers.getInitialUser()) 
        const user = await userObject.save()
        const brunches = await helpers.getInitialBrunches(user._id)
    
        await Brunch.deleteMany({})
        const brunchObjects = brunches.map(brunch => new Brunch(brunch))
        const promiseArray = brunchObjects.map(brunch => brunch.save())
        await Promise.all(promiseArray)
    })

    test('brunches are returned as json', async () => {
        await api
          .get('/api/brunches')
          .expect(200)
          .expect('Content-Type', /application\/json/) // using Regex
      })

    test.only('Correct number of brunches is returned', async () => {
        const response = await api.get('/api/brunches')
        assert.strictEqual(response.body.length, helpers.initialBrunches.length)
      })
})


  after(async () => {
    await mongoose.connection.close()
  })