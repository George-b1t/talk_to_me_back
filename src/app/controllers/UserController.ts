import { Request, Response } from "express";
import { prismaClient } from "../../../prisma/prismaClient";
import { hashSync } from "bcryptjs";

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, nickname, password } = req.body;

    if (!name || !nickname || !password) {
      throw new Error("Empty field");
    }

    await prismaClient.user.create({
      data: {
        name,
        nickname,
        password: hashSync(password, 8),
      },
    });

    return res.json({
      message: "User created successfully",
    });
  }
}

export const userController = new UserController();
