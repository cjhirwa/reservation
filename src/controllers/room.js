import Room from '../models/room'
import multer from 'multer'
import cloudinary from '../helper/cloudinary'
import Reservation from '../models/reservation'

class roomController{
static createRoom = async (request, response) => {
    try {
    const room = new Room(request.body);
    if(request.body === ''){
        response.status(400).send({ error: 'Request body is empty' })
    }
    const roomie = await Room.findOne({ name: request.body.name })
    if (roomie) {
        response.status(400).send({ error: 'Already registered.' })
    }
        const savedRoom = await room.save();
        if (savedRoom) {
            response.status(200).json(savedRoom);
        } else {
            // Handle the case where the room couldn't be saved
            response.status(500).json({ error: 'Room could not be saved' });
        }
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}

// static createRoom =async(request, response) => {
//         const room = new Room(request.body)
//         try {
//             await room.save()
//             response.status(200).json(room)
//         } catch (error) {
//             console.log(error)
//         }
//     }
// static uniqueRoom=async(request, response, next) => {
//     try {
//         const room = await Room.findOne({ name: request.body.name })
//         if (room) {
//             response.status(401).send({ error: 'Already registered.' })
//         }
//         else{
//         request.room = room
//         }
//         next()
//     } catch (e) {
//         response.status(500).send()
//     }
// }

static getAll = async(request, response) => { 
    const sort = {}
    if (request.query.sortBy) {
        const parts = request.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
       const rooms= await Room.find().sort(sort)
        .limit(parseInt(request.query.limit));
        if (!rooms) {
            return response.status(404).send('No room found')
        }
        response.send(rooms)
    } catch (e) {
        response.send(e)
    }
}

static list=async(request, response) => { 
    const sort = {}
   const check_in_date=request.params.check_in_date;
   const  check_out_date=request.params.check_out_date;
    if (request.query.sortBy) {
        const parts = request.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const excluded_rooms = await Reservation.find(
            {
                $or: [
                    { $and: [{checkInDate: { $lte: check_in_date}}, {checkOutDate: { $gte: check_out_date}}] },
                    { $and: [{checkInDate: { $gte: check_in_date}}, {checkOutDate: { $lte: check_out_date}}] },

                    { $and: [{checkInDate: { $gte: check_in_date}}, {$and:[{checkOutDate: { $gte: check_out_date}},{checkInDate: { $lte: check_out_date}}]}] },

                    { $and: [{$and:[{checkInDate: { $lte: check_in_date}},{checkOutDate: { $gte: check_in_date}}]}, {checkOutDate: { $lte: check_out_date}}] },
                ]
            }
        ).select('room_id');
        const excluded=[];
        excluded_rooms.forEach((room)=>{
            excluded.push(room.room_id);
        })

        const rooms=await Room.find({_id:{$nin:excluded}})
        response.status(200).json(rooms)
        
    } catch (e) {
        return response.status(500).send(e)
    }
}

static getRoomById=async(request, response) => {
    
    try {
        const room =await Room.findById(request.params.id)
        if (!room) {
            return response.status(404).send('room Not found')
        }
        return response.status(200).send(room)
    } catch (e) {
        return response.status(500).send(e)
    }
}
static updateRoom=async(request, response) => {
    const room = await Room.findById(request.params.id)
    const updates = Object.keys(request.body)
    const allowedUpdates = ['name', 'price', 'specifications', 'category_id','image']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid Update!' })
    }
    try {
        updates.forEach((update) => room[update] = request.body[update])
        
        await room.save()
        response.send(room)
    } catch (e) {
        
        response.status(400).send(e)
    }
}
static deleteRoom=async(request, response) => {
    try {
        const room = await Room.findById(request.params.id)
        if(!room){
            return response.status(404).send({ error: 'Room not found' })
        }
        await room.remove()
        return res.status(200).json({ message:" Room deleted successfuly"})
    } catch (e) {
        console.log(e)
        return response.status(500).send({ error: e.message })
    }
}
static upload = multer({
        storage: multer.diskStorage({}),   
    filename:(req, file, cb) =>{
       cb(null, new Date().toISOString() + file.originalname);
     },
    limits: {
        fileSize: 5000000
    },
    fileFilter(request, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(response.send('Only jpg and png allowed'))
        }
else{
        callback(undefined, true)
}
    }
})
static uploadImage=this.upload.single('image')
static addRoomImage=async(request, response) => {
    try{
    const room = await Room.findById(request.params.id)
    const result=await cloudinary.uploader.upload(request.file.path)
    room.image = result.secure_url
    await room.save()
    response.send(room)
    }
    catch(e){
    response.status(500).send(e)
    }
}
static addImage= (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

static getRoomImage=async(request, response) => {
    try {
        const room = await Room.findById(request.params.id)
        if (!room || !room.avatar) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(room.avatar)
    } catch (e) {
        response.status(404).send(e)
    }
}
}
export default roomController