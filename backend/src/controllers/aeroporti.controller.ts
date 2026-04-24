import { pool } from "@/services/db.services";
import { Request, Response, NextFunction } from "express";

export async function getAeroporti(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query("SELECT * FROM aeroporti ORDER BY nome ASC");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}
