import { prismaClient } from "../../../prisma/prismaClient";

async function getRoomsIdsByUser(user_id: number) {
  const rooms = await prismaClient.linkUserRoom.findMany({
    where: {
      user_id,
    },
  });

  const roomsIds = rooms.map((r) => String(r.room_id));

  return roomsIds;
}

export { getRoomsIdsByUser };
