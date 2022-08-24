import { Router } from "express";
import { messageController } from "../controllers/MessageController";
import { authMiddlewareController } from "../middlewares/AuthMiddlewareController";

const messageRoutes = Router();

messageRoutes.use(authMiddlewareController.execute);

messageRoutes.post("/create", messageController.create);
messageRoutes.get("/listByRoom", messageController.getByRoomId);

export { messageRoutes };
