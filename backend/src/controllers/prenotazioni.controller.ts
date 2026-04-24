import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function getPrenotazioniUser(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = (req as any).user.id;
        const result = await pool.query(
            "SELECT id, utente_id as passeggero_id, volo_id, data_prenotazione, prezzo_finale as prezzo, posto, classe, tipo_bagaglio FROM prenotazioni WHERE utente_id = $1 ORDER BY data_prenotazione DESC",
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
        
        let query = `
            SELECT p.*, v.ora_partenza, v.ora_arrivo, v.aeroporto_partenza_id, v.aeroporto_arrivo_id,
                   u.nome as utente_nome, u.cognome as utente_cognome
            FROM prenotazioni p
            JOIN voli v ON p.volo_id = v.id
            JOIN utenti u ON p.utente_id = u.id
            WHERE p.id = $1
        `;
        let params: any[] = [id];
        
        if (ruolo !== 'admin') {
            query += " AND p.utente_id = $2";
            params.push(utenteId);
        }
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Prenotazione non trovata o accesso negato");
        }
        
        const row = result.rows[0];
        
        // Fetch passengers
        const passengersResult = await pool.query("SELECT * FROM passeggeri WHERE prenotazione_id = $1", [id]);
        
        res.json({
            ...row,
            passeggeri: passengersResult.rows
        });
    } catch (error) {
        next(error);
    }
}

export async function createPrenotazione(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = (req as any).user.id;
        const { volo_id, posto, classe, tipo_bagaglio, prezzo_finale, passeggeri } = req.body;
        
        const result = await pool.query(
            `INSERT INTO prenotazioni (utente_id, volo_id, prezzo_finale, posto, classe, tipo_bagaglio)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, utente_id as passeggero_id, volo_id, data_prenotazione, prezzo_finale as prezzo, posto, classe, tipo_bagaglio`,
            [utenteId, volo_id, prezzo_finale, posto, classe, tipo_bagaglio]
        );
        
        const prenotazione = result.rows[0];
        
        if (passeggeri && Array.isArray(passeggeri)) {
            for (const p of passeggeri) {
                await pool.query(
                    "INSERT INTO passeggeri (prenotazione_id, nome, cognome, data_nascita, nazionalita) VALUES ($1, $2, $3, $4, $5)",
                    [prenotazione.id, p.nome, p.cognome, p.data_nascita, p.nazionalita]
                );
            }
        }
        
        res.status(201).json(prenotazione);
    } catch (error) {
        next(error);
    }
}

export async function getPrenotazioniAdmin(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query("SELECT id, utente_id as passeggero_id, volo_id, data_prenotazione, prezzo_finale as prezzo, posto, classe, tipo_bagaglio FROM prenotazioni ORDER BY data_prenotazione DESC");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}
