require('bcrypt')
const User = require('../models/user')

const getInitialUser = async () => {

    const passwordHash = await bcrypt.hash('sekret', 10)
    
    return {
    "name": "Test User",
    "username": "testoo",
    "passwordHash": passwordHash
    }
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { getInitialUser, usersInDb }