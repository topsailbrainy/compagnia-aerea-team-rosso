import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function getAerei(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query("SELECT * FROM aerei ORDER BY modello ASC");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function getAereoById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM aerei WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Aereo non trovato");
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function createAereo(req: Request, res: Response, next: NextFunction) {
    try {
        const { capienza, stato, modello } = req.body;
        const result = await pool.query(
            "INSERT INTO aerei (capienza, stato, modello) VALUES ($1, $2, $3) RETURNING *",
            [capienza, stato ?? true, modello]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function deleteAereo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM aerei WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Aereo non trovato");
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
