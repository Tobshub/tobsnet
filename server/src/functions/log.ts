import pino from "pino";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });

const pinoLog = pino({ transport: { target: "pino-pretty" } });

/** Pino Log Wrapper */
export const LOG = pinoLog;
