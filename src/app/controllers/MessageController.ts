import { Request, Response } from "express";
import { prismaClient } from "../../../prisma/prismaClient";

class MessageController {
  async create(req: Request, res: Response): Promise<Response> {
    const { room_id, user_id, content } = req.body;

    await prismaClient.message.create({
      data: {
        room_id,
        user_id,
        date: new Date(),
        content,
      },
    });

    return res.json({
      message: "Message created",
    });
  }
}

export const messageController = new MessageController();
