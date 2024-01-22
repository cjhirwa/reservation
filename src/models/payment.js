
import mongoose from 'mongoose'
const paymentSchema = mongoose.Schema({
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'reservation'
    },
    paymentType: {
        type: String
    },
    paymentMean: {
        type:String
    },
    reference: {
        type: String
    }
}, {Timestamps:true})


const Payment = mongoose.model('payment', paymentSchema)

export default Payment