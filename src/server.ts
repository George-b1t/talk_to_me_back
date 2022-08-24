import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";
import { router } from "./app/routes";
import { getRoomsIdsByUser } from "./app/helpers/getRoomsIdsByUser";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
    console.log(`User ${user_id} connected to socket`);

    const rooms = await getRoomsIdsByUser(user_id);

    socket.join(rooms);
  });

  socket.on("chat message", ({ message, room_id }) => {
    console.log({ message, room_id: String(room_id) });
    io.to(String(room_id)).emit("chat message", { message });
  });
});

server.listen(3333, () => {
  console.log("Server running on port 3333!");
});
