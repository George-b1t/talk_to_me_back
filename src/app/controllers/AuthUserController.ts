import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prismaClient } from "../../../prisma/prismaClient";

class AuthUserController {
  async login(req: Request, res: Response) {
    const { nickname, password } = req.body;

    const user = await prismaClient.user.findUnique({ where: { nickname } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = sign({ id: user.id }, String(process.env.HASH_TOKEN), {
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
      },
    });
  }
}

export const authUserController = new AuthUserController();
