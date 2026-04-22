import {pool} from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import  {Volo} from "@/dtos/entities.types";
import { Request, Response } from "express";

export async function voliGET(_req: Request, res: Response) {
    const results = await pool.query<Volo>(`
        SELECT * FROM voli
        ORDER BY cognome ASC
    `)
    res.json(results.rows)
}

export async function voliPOST(req: Request, res: Response) {
    const {aereoporto_partenza_id, aereoporto_arrivo_id, data_partenza, data_arrivo, ora_arrivo} = req.body;
    const results = await pool.query<Volo>(`
        INSERT INTO voli (aereoporto_partenza_id, aereoporto_arrivo_id, data_partenza, data_arrivo, ora_arrivo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *  
    `, [aereoporto_partenza_id, aereoporto_arrivo_id, data_partenza, data_arrivo, ora_arrivo])
    res.status(201).json(results.rows[0])
}

export async function voliPUT(req: Request, res: Response) {
    const {aereoporto_partenza_id, aereoporto_arrivo_id, data_partenza, data_arrivo, ora_arrivo} = req.body;
    const results = await pool.query<Volo>(`
        UPDATE voli
        SET aereoporto_partenza_id = $1, aereoporto_arrivo_id = $2, data_partenza = $3, data_arrivo = $4, ora_arrivo = $5
        WHERE id = $6
        RETURNING *  
    `, [aereoporto_partenza_id, aereoporto_arrivo_id, data_partenza, data_arrivo, ora_arrivo])
    res.status(200).json(results.rows[0])
}


export async function voliDELETE(req: Request, res: Response) {
    const {id} = req.params;
    const results = await pool.query<Volo>(`
        DELETE FROM voli
        WHERE id = $1
        RETURNING *  
    `, [id])
    res.status(200).json(results.rows[0])
}   

export async function ensureVoliExists(id: string) {
    const result = await pool.query<Volo>(`
        SELECT * FROM voli
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Volo non trovato")
    }
    return result.rows[0]
}