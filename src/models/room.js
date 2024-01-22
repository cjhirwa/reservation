import mongoose from 'mongoose'
import Reservation from './reservation'

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    specifications: {
        type: String
    },
    image: {
        type: String,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    }
}, { timestamps: true })

roomSchema.virtual('reservations', {
    ref: 'reservation',
    localField: '_id',
    foreignField: 'room_id'
})


//delete user's reservation when room is deleted
roomSchema.pre('remove', async function(next) {
    const room = this
    await Reservation.deleteMany({ room_id: room._id })
    next()
})

const Room = mongoose.model('room', roomSchema)
export default Room