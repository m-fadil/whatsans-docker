import pino from "pino";

const logger = pino({
  level: "silent",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
