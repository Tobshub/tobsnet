import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { PrismaConnect } from "./config";
import trpcRouter from "./app/router";
import { LOG } from "./functions";

config();
PrismaConnect();

/** Exports global enviroment variables from `.env` */
export const env = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
};

const app = express();
app.use(cors(), express.json());

// "/api" endpoints use trpcRouter
app.use("/api", trpcRouter);

app.use("/health", (req, res) => {
  LOG.info("health check... done");
  res.send({ status: "alive and well" });
});

app.use("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.listen(env.port, () => {
  console.log("app live");
  LOG.info(`live port(${env.port})`);
});
