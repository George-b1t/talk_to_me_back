import { Request, Response } from "express";
import { prismaClient } from "../../../prisma/prismaClient";

class RoomController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, is_private, user_id } = req.body;

    if (!name || !user_id || (is_private !== false && is_private !== true)) {
      throw new Error("Empty filed");
    }

    const createdRoom = await prismaClient.room.create({
      data: {
        name,
        is_private,
      },
    });

    await prismaClient.linkUserRoom.create({
      data: {
        is_adm: true,
        user_id,
        room_id: createdRoom.id,
      },
    });

    return res.json({
      message: "Room created successfully",
    });
  }

  async linkUser(req: Request, res: Response): Promise<Response> {
    const { room_id, user_id_from, nickname } = req.body;

    if (!room_id || !user_id_from || !nickname) {
      throw new Error("Empty filed");
    }

    const findLinkCreator = await prismaClient.linkUserRoom.findUnique({
      where: {
        id: user_id_from,
      },
    });

    if (!findLinkCreator?.is_adm) {
      throw new Error("No permission");
    }

    const findLinkUser = await prismaClient.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    if (!findLinkUser) {
      throw new Error("No user found");
    }

    await prismaClient.linkUserRoom.create({
      data: {
        room_id,
        is_adm: false,
        user_id: findLinkUser.id,
      },
    });

    return res.json({
      message: "Added user to room",
    });
  }
}

export const roomController = new RoomController();
