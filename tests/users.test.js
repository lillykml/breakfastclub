const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helpers = require('./testhelpers')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const userData = await helpers.getInitialUser()
  const user = new User(userData)
  await user.save()
})

describe('Creating a new user', () => {

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helpers.usersInDb()
    
        const newUser = {
          username: 'schnicki',
          name: 'Nik Snyder',
          password: 'summertime',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
      })

    test('creation fails for a missing username', async () => {
      const usersAtStart = await helpers.usersInDb()

      const newUser = {
          name: 'Nik Snyder',
          password: 'summertime',
      }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

      const usersAtEnd = await helpers.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails for a duplicated username', async () => {
      const usersAtStart = await helpers.usersInDb()

      const newUser = {
          username: 'testoo',
          name: 'Nik Snyder',
          password: 'summertime',
        }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

      const usersAtEnd = await helpers.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails for an invalid username', async () => {
      const usersAtStart = await helpers.usersInDb()
  
      const newUser = {
          username: 'test',
          name: 'Nik Snyder',
          password: 'summertime',
        }
  
      await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  
      const usersAtEnd = await helpers.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails for a missing name', async () => {
      const usersAtStart = await helpers.usersInDb()
  
      const newUser = {
          username: 'schnicki',
          password: 'summertime',
        }
  
      await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  
      const usersAtEnd = await helpers.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
  

    test('creation fails for a missing password', async () => {
      const usersAtStart = await helpers.usersInDb()
  
      const newUser = {
          name: 'Nik Snyder',
          username: 'schnicki',
        }
  
      await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  
      const usersAtEnd = await helpers.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})

describe('Retrieving users', () => {

  test('User information is returned as json', async () => {
    await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
    await mongoose.connection.close()
})
