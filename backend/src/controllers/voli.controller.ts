import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Volo } from "@/dtos/entities.types";
import { Request, Response } from "express";
import { buildUpdateQuery } from "@/utils/sql.utils";

export async function voliGET(_req: Request, res: Response) {
    const results = await pool.query<Volo>(`
        SELECT * FROM voli
        ORDER BY data_partenza ASC, ora_partenza ASC
    `)
    res.json(results.rows)
}

export async function voliPOST(req: Request, res: Response) {
    const { aeroporto_partenza_id, aeroporto_arrivo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo } = req.body;
    const results = await pool.query<Volo>(`
        INSERT INTO voli (aeroporto_partenza_id, aeroporto_arrivo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *  
    `, [aeroporto_partenza_id, aeroporto_arrivo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo])
    res.status(201).json(results.rows[0])
}

export async function voliPUT(req: Request, res: Response) {
    const { id, ...data } = req.body;

    await ensureVoliExists(id);

    const { text, values } = buildUpdateQuery({
        table: "voli",
        idColumn: "id",
        idValue: id,
        data,
        returning: "*"
    });

    const results = await pool.query<Volo>(text, values);
    res.status(200).json(results.rows[0])
}

export async function voliDELETE(req: Request, res: Response) {
    const { id } = req.params;
    const results = await pool.query<Volo>(`
        DELETE FROM voli
        WHERE id = $1
        RETURNING *  
    `, [id])

    if (results.rows.length === 0) {
        throw new AppError(404, "Volo non trovato")
    }

    res.status(200).json(results.rows[0])
}

export async function ensureVoliExists(id: number) {
    const result = await pool.query<Volo>(`
        SELECT * FROM voli
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Volo non trovato")
    }
    return result.rows[0]
}
