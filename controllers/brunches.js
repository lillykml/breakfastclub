const mongoose = require('mongoose')
const brunchRouter = require('express').Router()
const Brunch = require('../models/brunch')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


brunchRouter.get('/', async (request, response) => {
    const brunches = await Brunch.find({})
    .populate('organizer', {username: 1})
    .populate('attendees', {username: 1})
    response.json(brunches)
})

brunchRouter.get('/:id', async (request, response) => {

    const brunch = await Brunch
    .findById(request.params.id)
    .populate('organizer', {username: 1})
    .populate('attendees', {username: 1})
    if (brunch) {
        response.json(brunch)
    } else {
        response.status(404).end()
    }
})

brunchRouter.delete('/:id', async (request, response) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    const brunchId = request.params.id
    const brunch = await Brunch.findById(brunchId).session(session)
    const organizerId = brunch.organizer
    const attendees = brunch.attendees

    await Brunch.findByIdAndDelete(brunchId).session(session)

    await User.findByIdAndUpdate(organizerId, { 
        $pull: { organizedBrunches: brunchId }
      }).session(session)

    await User.updateMany(
        { _id: { $in: attendees } },
        { $pull: { brunches: brunchId } }
    ).session(session)

    await session.commitTransaction();
    session.endSession();
    
    response.status(204).end()
})


brunchRouter.post('/', async (request, response) => {

    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
    const organizer = await User.findById(decodedToken.id)

    const brunch = new Brunch({
    datetime: body.datetime,
    locationName: body.location,
    address: body.address,
    spots: body.spots,
    organizer: organizer.id,
    attendees: [organizer.id],
    })

    const newBrunch = await brunch.save()
    organizer.brunches = organizer.brunches.concat(newBrunch._id)
    organizer.organizedBrunches = organizer.organizedBrunches.concat(newBrunch._id)
    await organizer.save()
    response.status(201).json(newBrunch)
})

brunchRouter.put('/:id/signup', async (request, response) => {
    const brunchId = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }
    const userId = decodedToken.id;

    const session = await mongoose.startSession();
    session.startTransaction();
    const brunch = await Brunch.findById(brunchId).session(session);
    if (!brunch) {
        await session.abortTransaction();
        session.endSession();
        return response.status(404).json({ error: 'Brunch not found' });
    }
    if (brunch.attendees.includes(userId)) {
        await session.abortTransaction();
        session.endSession();
        return response.status(400).json({ error: 'User already signed up' });
    }

    brunch.attendees.push(userId);
    let savedBrunch = await brunch.save({ session });

    const user = await User.findById(userId).session(session);
    user.brunches.push(brunchId);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    response.status(200).json(savedBrunch);
})

brunchRouter.put('/:id/deregister', async (request, response) => {
    const brunchId = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }
    const userId = decodedToken.id;

    const session = await mongoose.startSession();
    session.startTransaction();
    const brunch = await Brunch.findById(brunchId).session(session);
    if (!brunch) {
        await session.abortTransaction();
        session.endSession();
        return response.status(404).json({ error: 'Brunch not found' });
    }
    if (!brunch.attendees.includes(userId)) {
        await session.abortTransaction();
        session.endSession();
        return response.status(400).json({ error: 'User already is not registered for the brunch' });
    }

    const savedBrunch = await Brunch.findByIdAndUpdate(brunchId, { 
        $pull: { attendees: userId }}, { new: true }).session(session)

    await User.findByIdAndUpdate(userId, { 
        $pull: { brunches: brunchId }
      }).session(session)

    await session.commitTransaction();
    session.endSession();
    response.status(200).json(savedBrunch);
})

module.exports = brunchRouter