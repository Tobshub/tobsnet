import pino from "pino";

const pinoLog = pino({ transport: { target: "pino-pretty" } });

/** Pino Log Wrapper */
export const LOG = pinoLog;
