import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";
import { router } from "./app/routes";
import { host } from "../host";
import { getUsersIdsByRoom } from "./app/helpers/getUsersIdsByRoom";
import { getUserIdByNickname } from "./app/helpers/getUserIdByNickname";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: `http://${host}:3000`,
  },
});

app.use(cors());
app.use(express.json());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    message: err.message,
  });
});

io.on("connection", (socket) => {
  socket.on("rooms", async (user_id) => {
    socket.join(String(user_id));
  });

  socket.on("new_room", ({ room }) => {
    io.to(String(room.LinkUserRoom[0].user_id)).emit("room", room);
  });

  socket.on("new_room_user", async ({ nickname, room }) => {
    const user_id = await getUserIdByNickname(nickname);

    io.to(String(user_id)).emit("room", room);
  });

  socket.on("chat message", async ({ message }) => {
    const ids = await getUsersIdsByRoom(message.room_id);
    io.to(ids).emit("chat message", message);
  });
});

server.listen(3333, () => {
  console.log("Server running on port 3333!");
});
