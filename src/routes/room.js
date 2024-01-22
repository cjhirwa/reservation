import express from 'express'
import authentication from '../authentication/authentication'
import roomController from '../controllers/room'

const roomRouter = express.Router()
roomRouter.post('/room/create', roomController.createRoom)
roomRouter.get('/rooms', roomController.getAll)
roomRouter.get('/room/:id', roomController.getRoomById)
roomRouter.get('/list/:check_in_date/:check_out_date', roomController.list)
roomRouter.patch('/room/:id/update',  roomController.updateRoom)
roomRouter.delete('/room/:id/delete', authentication.isAdmin, roomController.deleteRoom)
roomRouter.post('/room/avatar/:id', authentication.isAdmin, roomController.uploadImage,roomController.addRoomImage, roomController.addImage)
roomRouter.get('/room/avatar/:id', roomController.getRoomImage)

export default roomRouter