import { Router } from "express";
import { roomController } from "../controllers/RoomController";
import { authMiddlewareController } from "../middlewares/AuthMiddlewareController";

const roomRoutes = Router();

roomRoutes.use(authMiddlewareController.execute);

roomRoutes.post("/create", roomController.create);
roomRoutes.get("/listByUser", roomController.listByUserId);
roomRoutes.post("/linkUser", roomController.linkUser);

export { roomRoutes };
