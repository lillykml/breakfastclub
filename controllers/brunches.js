const brunchRouter = require('express').Router()
const Brunch = require('../models/brunch')
const User = require('../models/user')


brunchRouter.get('/', async (request, response) => {
    const brunches = await Brunch.find({}).populate('organizer', {username: 1})
    response.json(brunches)
})

brunchRouter.get('/:id', async (request, response) => {

    const brunch = await Brunch.findById(request.params.id)
    if (brunch) {
        response.json(brunch)
    } else {
        response.status(404).end()
    }
})

brunchRouter.delete('/:id', async (request, response) => {
    await Brunch.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


brunchRouter.post('/', async (request, response) => {

    const body = request.body
    const organizer = await User.findById(body.organizerId)

    const brunch = new Brunch({
    datetime: body.datetime,
    locationName: body.location,
    address: body.address,
    spots: body.spots,
    organizer: organizer.id

    })

    const newBrunch = await brunch.save()
    organizer.brunches = organizer.brunches.concat(newBrunch._id)
    await organizer.save()
    response.status(201).json(newBrunch)
})

module.exports = brunchRouter