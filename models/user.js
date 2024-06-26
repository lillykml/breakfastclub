const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  brunches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brunch'
    }
  ],
  organizedBrunches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brunch'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User