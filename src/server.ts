import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";
import { router } from "./app/routes";

const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

app.use(cors());
app.use(express.json());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    message: err.message,
  });
});

server.listen(3333, () => {
  console.log("Server running on port 3333!");
});
