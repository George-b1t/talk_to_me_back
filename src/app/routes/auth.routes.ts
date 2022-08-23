import { Router } from "express";
import { authUserController } from "../controllers/AuthUserController";

const authRoutes = Router();

authRoutes.post("/login", authUserController.login);

export { authRoutes };
