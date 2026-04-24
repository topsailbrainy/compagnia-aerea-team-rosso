import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function getPrenotazioniUser(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = (req as any).user.id;
        const result = await pool.query(
            "SELECT * FROM prenotazioni WHERE utente_id = $1 ORDER BY data_prenotazione DESC",
            [utenteId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function getPrenotazioneById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const utenteId = (req as any).user.id;
        const ruolo = (req as any).user.ruolo;
        
        let query = "SELECT * FROM prenotazioni WHERE id = $1";
        let params: any[] = [id];
        
        if (ruolo !== 'admin') {
            query += " AND utente_id = $2";
            params.push(utenteId);
        }
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Prenotazione non trovata o accesso negato");
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function createPrenotazione(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = (req as any).user.id;
        const { volo_id, posto, classe, tipo_bagaglio } = req.body;
        
        // Recupero prezzo base dal volo
        const voloResult = await pool.query("SELECT prezzo_base FROM voli WHERE id = $1", [volo_id]);
        if (voloResult.rows.length === 0) {
            throw new AppError(404, "Volo non trovato");
        }
        
        const prezzo_finale = voloResult.rows[0].prezzo_base; // Logica di calcolo prezzo può essere espansa
        
        const result = await pool.query(
            `INSERT INTO prenotazioni (utente_id, volo_id, prezzo_finale, posto, classe, tipo_bagaglio)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [utenteId, volo_id, prezzo_finale, posto, classe, tipo_bagaglio]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function getPrenotazioniAdmin(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query("SELECT * FROM prenotazioni ORDER BY data_prenotazione DESC");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}
