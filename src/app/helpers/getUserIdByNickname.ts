import { prismaClient } from "../../../prisma/prismaClient";

async function getUserIdByNickname(nickname: string) {
  const id =
    (
      await prismaClient.user.findUnique({
        where: {
          nickname,
        },
      })
    )?.id ?? null;

  return id;
}

export { getUserIdByNickname };
