const mongoose = require('mongoose')

const brunchSchema = new mongoose.Schema({
    datetime: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > new Date()
            },
            message: props => 'The brunch date must be in the future'
        }
    },
    locationName: {
        type: String,
        required: true,
        minLength: 3
    },
    address: {
        type: String,
        required: true
    },
    spots: {
        type: Number,
        validate: {
            validator: function(v) {
                return v < 9
            },
            message: props => 'We want our brunches to be intimate so the maximum number of people is 8.'
        }
    },
    attendees: {
        type: Number,
        default: 1
    },
    full: {
        type: Boolean,
        default: false
  }})

  brunchSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Brunch', brunchSchema)