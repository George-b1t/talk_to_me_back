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

  async listByRoom(req: Request, res: Response): Promise<Response> {
    const { room_id } = req.query;

    if (!room_id) {
      throw new Error("Invalid room");
    }

    const links = await prismaClient.linkUserRoom.findMany({
      where: {
        room_id: Number(room_id),
      },
    });

    const users = await prismaClient.user.findMany({
      where: {
        id: {
          in: links.map((link) => link.user_id),
        },
      },
    });

    return res.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
      })),
    });
  }
}

export const userController = new UserController();
