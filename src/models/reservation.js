
import mongoose from 'mongoose'
const reservationSchema = mongoose.Schema({
    checkInDate: {
        type: Date
    },
    checkOutDate: {
        type: Date
    },
    special_info: {
        type:String
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    },
    reference:{
        type:String
    },
    status:{
        type:String
    }
}, {Timestamps:true})


const Reservation = mongoose.model('reservation', reservationSchema)

export default Reservation