import { Router } from "express";
import { userController } from "../controllers/UserController";
import { authMiddlewareController } from "../middlewares/AuthMiddlewareController";

const userRoutes = Router();

userRoutes.post("/create", userController.create);
userRoutes.get(
  "/listByRoom",
  authMiddlewareController.execute,
  userController.listByRoom
);

export { userRoutes };
