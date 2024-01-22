import mongoose from 'mongoose'
import Room from './room'

const categorySchema = mongoose.Schema({
    name: {
        type: String
    },
}, { timestamps: true })

categorySchema.virtual('rooms', {
    ref: 'room',
    localField: '_id',
    foreignField: 'category_id'
})


//delete categories's rooms when category is deleted
categorySchema.pre('remove', async function(next) {
    const category = this
    await Room.deleteMany({ category_id: category._id })
    next()
})
const Category = mongoose.model('category', categorySchema)
export default Category