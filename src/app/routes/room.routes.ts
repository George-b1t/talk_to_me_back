import { Router } from "express";
import { roomController } from "../controllers/RoomController";

const roomRoutes = Router();

roomRoutes.post("/create", roomController.create);
roomRoutes.post("/linkUser", roomController.linkUser);

export { roomRoutes };
