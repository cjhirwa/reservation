import Reservation from "../models/reservation";
import Room from "../models/room";
import { merge } from "merge";
class reservationController{
    static makeReservation=async (request, response) => {
        const specialInfo=request.body.special_info
        const cInDate=request.params.cindate
        const cOutDate=request.params.coutdate
        const owner=request.customer._id
        const room=request.params.room

        const reservation=new Reservation({
            checkInDate:cInDate,
            checkOutDate:cOutDate,
            room_id:room,
            customer_id: owner,
            special_info:specialInfo,
            reference:this.generateRefNo(3),
            status:'pending'
          })
        try {
          const newReservation=await reservation.save();
          response.status(200).json(newReservation);
        } catch (e) {
          return response.status(500).json(e);
        }
      }
      static generateRefNo=(length)=>{
        const refno=Math.floor(Math.random() * (999999 - 111111) + 111111)
        let result           = "";
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result+'-'+refno;
    }
   static getMyReservations=async(request, response) => {
            const match = {}
            const sort = {}
            if (request.query.closed) {
                match.status = request.query.closed
            }
            if (request.query.sortBy) {
                const parts = request.query.sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }
            try {
                await request.customer.populate({
                    path: 'reservations',
                    match,
                    options: {
                        limit: parseInt(request.query.limit),
                        skip: parseInt(request.query.skip),
                        sort
                    }
                })
                if (!request.customer.reservations) {
                    return response.status(404).send()
                }
                else{
                    const merged=[]
                    let res={}
                    const reservations=request.customer.reservations
                    for (let reservation of reservations) {
                        const room=await Room.findById(reservation.room_id);
                        reservation=reservation.toJSON()
                        res = merge(reservation, {"room_name":room.name})
                        merged.push(res) 
                    }
                    return response.send(merged);
                    
                }
                    
            } catch (e) {
                response.status(500).send()
            }
        }
        static getReservations=async(request, response) => {
            const match = {}
            const sort = {}
            if (request.query.closed) {
                match.status = request.query.closed
            }
            if (request.query.sortBy) {
                const parts = request.query.sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }
            try {
                const reservations=await Reservation.find().sort(sort).populate('rooms')
                return  response.status(200).send(reservations)
                }
                    
             catch (e) {
               return response.status(500).send()
            }
        }
}
export default reservationController