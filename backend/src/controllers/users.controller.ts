import { pool } from "../config/db.config";
import {AppError} from "../middlewares/error.middlewares";
import { Aereo, Aeroporto, Gate, Volo, Tratta, Passeggero, Prenotazione} from "@/dtos/entities.types";
import { Request, Response } from "express";

export async function prenotazioniGET(_req: Request, res: Response) {
    const results = await pool.query<Prenotazione>(`
        SELECT * FROM prenotazioni
        ORDER BY data_prenotazione DESC
    `)
    res.json(results.rows)
}

