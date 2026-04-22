import pino from "pino";

import pinoHttp from "pino-http";

export const logger = pino({level: process.env.LOG_LEVEL ?? "info"});

export const httpLogger = pinoHttp({
    logger,
    customLogLevel(_req, res, error) {
        if (error || res.statusCode >= 500) {
            return "error";
        }

        if (res.statusCode >= 400) {
            return "warn";
        }

        return "info";
    },
});