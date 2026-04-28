import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middlewares";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

export function authMw(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // No token provided, proceed as guest
        return next();
    }

    const token = authHeader.split(" ")[1]!;
    
    // Check if the token is literal 'null' or 'undefined' string (common frontend bug)
    if (token === 'null' || token === 'undefined' || !token) {
        return next();
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        (req as any).user = payload;
        next();
    } catch (error) {
        // Token provided but invalid
        next(new AppError(401, "Token non valido"));
    }
}

export function adminMw(req: Request, _res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user || user.ruolo !== 'admin') {
        return next(new AppError(403, "Accesso negato: richiesti privilegi admin"));
    }
    next();
}
