import express from "express";
import authentication from "../authentication/authentication";
import categoryController from "../controllers/roomCategory";

const categoryRouter = express.Router();
categoryRouter.post("/room/category", categoryController.uniqueCategory ,authentication.isAdmin, categoryController.createCategory);
categoryRouter.get("/category/:id", categoryController.getCategoryById);
categoryRouter.get("/categories", categoryController.getAll);
categoryRouter.get("/category/:id/rooms",categoryController.getCategoryRooms);
categoryRouter.patch("/category/:id", authentication.isAdmin, categoryController.getCategoryRooms);
categoryRouter.delete("/category/:id", authentication.isAdmin, categoryController.deleteCategory);

export default categoryRouter;
