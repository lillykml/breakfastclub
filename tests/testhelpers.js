const bcrypt = require('bcrypt')
const User = require('../models/user');
const brunch = require('../models/brunch');
const jwt = require('jsonwebtoken')

let initialBrunches = [
    {
        "datetime": "2024-07-14T08:30:00.000Z",
        "locationName": "Another super new Brunch Spot",
        "address": "Neureutherstrasse 1",
        "spots": 6,
    }, 
    {
        "datetime": "2024-07-23T08:30:00.000Z",
        "locationName": "Cafe Conté",
        "address": "Ainmillerstraße 1",
        "spots": 8,
    }
]

const getInitialBrunches = async (organizerID) => {

    initialBrunches = initialBrunches.map(brunch => ({
        ...brunch,
        organizer: organizerID
    }));
    return initialBrunches
}

const getInitialUser = async () => {

    const passwordHash = await bcrypt.hash('sekretsekret', 10)
    
    return {
    "name": "Lizzy User",
    "username": "testoo",
    "passwordHash": passwordHash,
    }
}

const brunchesInDb = async () => {
    const brunches = await brunch.find({})
    return brunches.map(brunch => brunch.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const getUserToken = async (user) => {
    return jwt.sign(user, process.env.SECRET)
}

module.exports = { getInitialUser, usersInDb, getInitialBrunches, initialBrunches, brunchesInDb, getUserToken}