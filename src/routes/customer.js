import express from "express";
import authentication from "../authentication/authentication";
import customerController from "../controllers/customer";
const customerRouter = express.Router();

customerRouter.get("/customers",authentication.isAdmin,customerController.getAll);
customerRouter.post("/customer/register",customerController.createAccount);
customerRouter.patch("/password/reset",customerController.resetPassword);
customerRouter.get("/customer/:id", authentication.userAuth,customerController.getCustomerById);
customerRouter.post("/customer/login", customerController.login);

customerRouter.post("/deleteaccount", customerController.deleteAccount);

customerRouter.post("/customer/logout", authentication.customerAuth, customerController.logout);
customerRouter.post("/customer/logoutAll", authentication.customerAuth, customerController.logoutAll);
customerRouter.get("/customer/me/profile", authentication.customerAuth, customerController.profile);
customerRouter.patch("/customer/me", authentication.customerAuth, customerController.updateProfile);
export default customerRouter;
