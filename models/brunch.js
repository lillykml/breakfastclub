const mongoose = require('mongoose')

const brunchSchema = new mongoose.Schema({
    datetime: {
        type: Date,
        required: true,
        validate:
            {
                validator: function(v) {
                    // Check if the datetime is in the future
                    const date = new Date(v);
                    return date > new Date();
                },
                message: props => `${props.value} is not in the future.`
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
        required: true,
        validate: {
            validator: function(v) {
                return v < 9
            },
            message: props => 'We want our brunches to be intimate so the maximum number of people is 8.'
        }
    },
    attendees: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
    ],
    full: {
        type: Boolean,
        default: false
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})


  brunchSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Brunch', brunchSchema)