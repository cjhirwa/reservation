import express from "express";
import reservationController from "../controllers/reservation";
import authentication from "../authentication/authentication";
import StripeController from "../controllers/stripe";
const reservationRouter=express.Router()

reservationRouter.post('/reservation/:cindate/:coutdate/:room',authentication.customerAuth,reservationController.makeReservation)

reservationRouter.get('/me/reservations',authentication.customerAuth,reservationController.getMyReservations)
reservationRouter.get('/reservations',authentication.userAuth,reservationController.getReservations)
reservationRouter.post('/reserve/pay',StripeController.stripePay)
export default reservationRouter;