import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middlewares";

export const userMw = (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user.id;
    if (!user) {
        return next(new AppError(401, "Utente non autenticato"));
    }
    next(); 
}


