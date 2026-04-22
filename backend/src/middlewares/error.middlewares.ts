import { Request, Response, NextFunction } from "express";
import { DatabaseError } from "pg";
import { ZodError } from "zod";

export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly isOperational: boolean = true,
        public readonly stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        this.stack = stack;
    }
}


