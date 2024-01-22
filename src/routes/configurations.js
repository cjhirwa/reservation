import express from "express";
import authentication from "../authentication/authentication";
import configController from "../controllers/configuration";
const configRouter = express.Router();

configRouter.get("/settings", configController.getSettings);
configRouter.patch("/settings/:id", authentication.isAdmin, configController.updateUser);
configRouter.post("/settings/add/avatar",authentication.isAdmin,configController.upload.single("avatar"),
configController.uploadAvatar,configController.uploadCallBack);
configRouter.get("/logo",configController.getLogo)
export default userRouter;
