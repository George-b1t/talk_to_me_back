import { Router } from "express";
import { userController } from "../controllers/UserController";

const userRoutes = Router();

userRoutes.post("/create", userController.create);

export { userRoutes };
