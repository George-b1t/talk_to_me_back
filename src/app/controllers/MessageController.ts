import { Request, Response } from "express";
import { prismaClient } from "../../../prisma/prismaClient";

class MessageController {
  async create(req: Request, res: Response): Promise<Response> {
    const { room_id, user_id, content } = req.body;

    const createdMessage = await prismaClient.message.create({
      data: {
        room_id,
        user_id,
        date: new Date(),
        content,
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    return res.json({
      message: "Message created",
      content: {
        createdMessage,
      },
    });
  }

  async listByRoomId(req: Request, res: Response): Promise<Response> {
    const { room_id } = req.query;

    if (!room_id) {
      throw new Error("Invalid room");
    }

    const messages = await prismaClient.message.findMany({
      where: {
        room_id: Number(room_id),
      },
      take: 10,
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    return res.json({
      messages,
    });
  }
}

export const messageController = new MessageController();
