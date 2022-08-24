import { Router } from "express";
import { messageController } from "../controllers/MessageController";

const messageRoutes = Router();

messageRoutes.post("/create", messageController.create);
messageRoutes.get("/listByRoom", messageController.getByRoomId);

export { messageRoutes };
