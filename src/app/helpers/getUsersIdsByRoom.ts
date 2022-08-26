import { prismaClient } from "../../../prisma/prismaClient";

async function getUsersIdsByRoom(room_id: number) {
  const users = await prismaClient.linkUserRoom.findMany({
    where: {
      room_id,
    },
  });

  const usersIds = users.map((r) => String(r.user_id));

  return usersIds;
}

export { getUsersIdsByRoom };
