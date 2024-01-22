import express from "express";
import authentication from "../authentication/authentication";
import userController from "../controllers/user";
const userRouter = express.Router();

userRouter.post("/user",userController.uniqueAccount,userController.createAccount);
userRouter.get("/users", authentication.isAdmin, userController.getUsers);
userRouter.get("/user/:id", authentication.isAdmin, userController.getUserById);
userRouter.post("/login", userController.login);
userRouter.post("/logout", authentication.userAuth, userController.logout);
userRouter.post("/logoutAll", authentication.userAuth, userController.logoutAll);
userRouter.get("/me", authentication.userAuth, userController.profile);
userRouter.patch("/user/:id", authentication.isAdmin, userController.updateUser);
userRouter.delete("/user/:id", authentication.isAdmin, userController.deleteAccount);
// userRouter.post("/me/avatar",authentication.isAdmin,userController.upload.single("avatar"),
// userController.uploadAvatar,userController.uploadCallBack);
userRouter.get("/user/avatar/:id", authentication.isAdmin, userController.getAvatar);
export default userRouter;
