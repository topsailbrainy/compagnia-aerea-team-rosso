import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Prenotazione } from "@/dtos/entities.types";
import { Request, Response } from "express";
import { buildUpdateQuery } from "@/utils/sql.utils";

export async function prenotazioniGET(_req: Request, res: Response) {
    const results = await pool.query<Prenotazione>(`
        SELECT * FROM prenotazioni
        ORDER BY data_prenotazione DESC
    `)
    res.json(results.rows)
}

export async function prenotazioniPOST(req: Request, res: Response) {
    const { passeggero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio } = req.body;
    const results = await pool.query<Prenotazione>(`
        INSERT INTO prenotazioni (passeggero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *  
    `, [passeggero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio])
    res.status(201).json(results.rows[0])
}

export async function prenotazioniPUT(req: Request, res: Response) {
    const { id, ...data } = req.body;
    
    await ensurePrenotazioneExists(id);

    const { text, values } = buildUpdateQuery({
        table: "prenotazioni",
        idColumn: "id",
        idValue: id,
        data,
        returning: "*"
    });

    const results = await pool.query<Prenotazione>(text, values);
    res.status(200).json(results.rows[0])
}

export async function prenotazioniDELETE(req: Request, res: Response) {
    const { id } = req.params;
    const results = await pool.query<Prenotazione>(`
        DELETE FROM prenotazioni
        WHERE id = $1
        RETURNING *  
    `, [id])

    if (results.rows.length === 0) {
        throw new AppError(404, "Prenotazione non trovata")
    }

    res.status(200).json(results.rows[0])
}

export async function ensurePrenotazioneExists(id: number) {
    const result = await pool.query<Prenotazione>(`
        SELECT * FROM prenotazioni
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Prenotazione non trovata")
    }
    return result.rows[0]
}
