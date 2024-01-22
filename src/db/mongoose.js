import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()

const connection = async() => {
    await mongoose.connect(`${process.env.DB_URL}${process.env.DB}`);
    console.log('Database connected')
}
export default connection