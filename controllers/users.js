const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  .populate('brunches', {datetime: 1, locationName: 1, address: 1, spots: 1, attendees: 1})
  .populate('organizedBrunches', { datetime: 1, locationName: 1, address: 1, spots: 1, attendees: 1 });
  response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.password) {
    return response.status(400).json({ error: 'password required' });
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter