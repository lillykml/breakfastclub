const brunchRouter = require('express').Router()
const Brunch = require('../models/brunch')


brunchRouter.get('/', async (request, response) => {
    const brunches = await Brunch.find({})
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

    const brunch = new Brunch({
    datetime: body.datetime,
    locationName: body.location,
    address: body.address,
    spots: body.spots
    })

    const newBrunch = await brunch.save()
    response.status(201).json(newBrunch)
})

module.exports = brunchRouter