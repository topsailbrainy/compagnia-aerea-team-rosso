import {pool} from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import  {Prenotazione} from "@/dtos/entities.types";
import { Request, Response } from "express";

export async function prenotazioniGET(_req: Request, res: Response) {
    const results = await pool.query<Prenotazione>(`
        SELECT * FROM passeggeri
        ORDER BY cognome ASC
    `)
    res.json(results.rows)
}

export async function prenotazioniPOST(req: Request, res: Response) {
    const {passegero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio} = req.body;
    const results = await pool.query<Prenotazione>(`
        INSERT INTO prenotazioni (passeggero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *  
    `, [prezzo, posto, classe, tipo_bagaglio])
    res.status(201).json(results.rows[0])
}

export async function prenotazioniPUT(req: Request, res: Response) {
    const {passegero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio} = req.body;
    const results = await pool.query<Prenotazione>(`
        UPDATE passeggeri
        SET passeggiero_id = $1, volo_id = $2, data_prenotazione = $3, prezzo = $4, posto = $5, classe = $6, tipo_bagaglio = $7
        WHERE id = $8
        RETURNING *  
    `, [passegero_id, volo_id, data_prenotazione, prezzo, posto, classe, tipo_bagaglio])
    res.status(200).json(results.rows[0])
}


export async function prenotazioniDELETE(req: Request, res: Response) {
    const {id} = req.params;
    const results = await pool.query<Prenotazione>(`
        DELETE FROM prenotazioni
        WHERE id = $1
        RETURNING *  
    `, [id])
    res.status(200).json(results.rows[0])
}   

export async function ensurePrenotazioneExists(id: string) {
    const result = await pool.query<Prenotazione>(`
        SELECT * FROM prenotazioni
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Prenotazione non trovata")
    }
    return result.rows[0]
}
