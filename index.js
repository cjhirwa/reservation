import express from 'express'
import cookieParser from 'cookie-parser'
import connection from './src/db/mongoose'
const app = express()
import customerRouter from './src/routes/customer'
import userRouter from './src/routes/user'
import categoryRouter from './src/routes/roomCategory'
import roomRouter from './src/routes/room'
import reservationRouter from './src/routes/reservation'
import morgan from 'morgan'
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
connection()
app.use(customerRouter)
app.use(userRouter)
app.use(categoryRouter)
app.use(roomRouter)
app.use(reservationRouter)
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log("The app is listening at port " + port)
})
module.exports = app