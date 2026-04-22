import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import { ZodError } from "zod";

export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = "AppError";
    }
}

export function errorMw(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof ZodError) {
        req.log.warn(
            {
                issues: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
            "Validation error"
        );

        return res.status(400).json({
            error: "Validation Error",
            details: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    if (error instanceof AppError) {
        req.log.warn({ statusCode: error.statusCode, details: error.details }, error.message);

        return res.status(error.statusCode).json({
            error: error.message,
            details: error.details,
        });
    }

    if (error instanceof DatabaseError) {
        if (error.code === "23505") {
            req.log.warn({ code: error.code, detail: error.detail }, "Unique constraint violation");

            return res.status(400).json({
                error: "Unique constraint violation",
                details: error.detail,
            });
        }

        if (error.code === "23503" || error.code === "22P02" || error.code === "22007") {
            req.log.warn({ code: error.code, detail: error.detail }, "Invalid request data");

            return res.status(400).json({
                error: "Invalid request data",
                details: error.detail ?? error.message,
            });
        }
    }

    req.log.error({ err: error }, "Unhandled error");

    return res.status(500).json({
        error: "Internal Server Error",
    });
}
