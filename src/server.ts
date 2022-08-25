import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";
import { router } from "./app/routes";
import { getRoomsIdsByUser } from "./app/helpers/getRoomsIdsByUser";
import { host } from "../host";

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
  socket.on("channel", async (user_id) => {
    const rooms = await getRoomsIdsByUser(user_id);

    socket.join(rooms);
  });

  socket.on("chat message", ({ message }) => {
    io.to(String(message.room_id)).emit("chat message", message);
  });
});

server.listen(3333, () => {
  console.log("Server running on port 3333!");
});
