import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function ricercaVoli(req: Request, res: Response, next: NextFunction) {
    try {
        const { aeroporto_partenza, aeroporto_arrivo, data_partenza } = req.body;
        
        const result = await pool.query(
            `SELECT * FROM voli 
             WHERE aeroporto_partenza_id = $1 
             AND aeroporto_arrivo_id = $2 
             AND data_partenza = $3`,
            [aeroporto_partenza, aeroporto_arrivo, data_partenza]
        );
        
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function getVoloById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM voli WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Volo non trovato");
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}
