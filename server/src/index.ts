import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { PrismaConnect } from "./config/prisma";
import trpcRouter from "./app/router";

config();
PrismaConnect();

/** Exports global enviroment variables from `.env` */
export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};

const app = express();
app.use(cors(), express.json());

// /api endpoints use trpcRouter
app.use("/api", trpcRouter);

app.use("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.listen(env.port, () => {
  console.log("live on port:", env.port);
});
