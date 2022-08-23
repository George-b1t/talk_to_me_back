import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prismaClient } from "../../../prisma/prismaClient";

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

class AuthMiddlewareController {
  async execute(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Invalid token");
    }

    const token = authorization.replace("Bearer", "").trim();

    try {
      const token_ = verify(token, String(process.env.HASH_TOKEN)) ?? {};

      const { id } = token_ as TokenPayload;

      const user = await prismaClient.user.findUnique({ where: { id } });

      if (!user) {
        throw new Error("Invalid token");
      }

      req.body = {
        ...req.body,
        usuario: user,
      };

      return next();
    } catch {
      throw new Error("Invalid token");
    }
  }
}

export const authMiddlewareController = new AuthMiddlewareController();
