import { Request, Response } from "express";
import { prismaClient } from "../../../prisma/prismaClient";

class RoomController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, is_private, user_id } = req.body;

    if (!name || !user_id || (is_private !== false && is_private !== true)) {
      throw new Error("Empty field");
    }

    const createdRoom = await prismaClient.room.create({
      data: {
        name,
        is_private,
      },
    });

    const createdLink = await prismaClient.linkUserRoom.create({
      data: {
        is_adm: true,
        user_id,
        room_id: createdRoom.id,
      },
    });

    return res.json({
      message: "Room created successfully",
      content: {
        createdRoom: {
          ...createdRoom,
          Message: [],
          LinkUserRoom: [createdLink],
        },
      },
    });
  }

  async listByUserId(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.query;

    if (!user_id) {
      throw new Error("Invalid user");
    }

    const links = await prismaClient.linkUserRoom.findMany({
      where: {
        user_id: Number(user_id),
      },
    });

    const rooms = await prismaClient.room.findMany({
      where: {
        id: {
          in: links.map((link) => link.room_id),
        },
      },
      include: {
        Message: {
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return res.json({
      rooms,
    });
  }

  async linkUser(req: Request, res: Response): Promise<Response> {
    const { room_id, user_id_from, nickname } = req.body;

    if (!room_id || !user_id_from || !nickname) {
      throw new Error("Empty field");
    }

    const findLinkCreator = await prismaClient.linkUserRoom.findFirst({
      where: {
        user_id: user_id_from,
        room_id: room_id,
      },
    });

    if (!findLinkCreator) {
      throw new Error("User creator not found");
    }

    const room = await prismaClient.room.findUnique({
      where: {
        id: room_id,
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    if (!findLinkCreator.is_adm && room.is_private) {
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

    const linkUserAlreadyExists = await prismaClient.linkUserRoom.findFirst({
      where: {
        room_id,
        user_id: findLinkUser.id,
      },
    });

    if (linkUserAlreadyExists) {
      throw new Error("User is already linked");
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
