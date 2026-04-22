import {pool} from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import  {Prenotazione} from "@/dtos/entities.types";
import { Request, Response } from "express";

export async function passeggeriGET(_req: Request, res: Response) {
    const results = await pool.query<Prenotazione>(`
        SELECT * FROM passeggeri
        ORDER BY cognome ASC
    `)
    res.json(results.rows)
}

export async function passeggeriPOST(req: Request, res: Response) {
    const {prezzo, posto, classe, tipo_bagaglio} = req.body;
    const results = await pool.query<Prenotazione>(`
        INSERT INTO prenotazioni (prezzo, posto, classe, tipo_bagaglio)
        VALUES ($1, $2, $3, $4)
        RETURNING *  
    `, [prezzo, posto, classe, tipo_bagaglio])
    res.status(201).json(results.rows[0])
}

export async function passeggeriPUT(req: Request, res: Response) {
    const {id, prezzo, posto, classe, tipo_bagaglio} = req.body;
    const results = await pool.query<Prenotazione>(`
        UPDATE passeggeri
        SET prezzo = $1, posto = $2, classe = $3, tipo_bagaglio = $4
        WHERE id = $5
        RETURNING *  
    `, [prezzo, posto, classe, tipo_bagaglio, id])
    res.status(200).json(results.rows[0])
}


export async function passeggeriDELETE(req: Request, res: Response) {
    const {id} = req.params;
    const results = await pool.query<Prenotazione>(`
        DELETE FROM prenotazioni
        WHERE id = $1
        RETURNING *  
    `, [id])
    res.status(200).json(results.rows[0])
}   

export async function ensurePasseggeroExists(id: string) {
    const result = await pool.query<Prenotazione>(`
        SELECT * FROM prenotazioni
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Prenotazione non trovato")
    }
    return result.rows[0]
}
