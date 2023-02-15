import pino from "pino";

const pinoLog = pino(pino.destination(`${process.cwd()}/dev.log`));

/** Pino Log Wrapper */
export const LOG = pinoLog;
