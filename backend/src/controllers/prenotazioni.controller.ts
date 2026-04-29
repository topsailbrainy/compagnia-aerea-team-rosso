import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function getPrenotazioniUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.json([]);
        }
        const utenteId = user.id;
        const result = await pool.query(
            `SELECT p.id, p.utente_id as passeggero_id, p.volo_id, p.data_prenotazione, 
                    p.prezzo_finale as prezzo, p.posto, p.classe, p.tipo_bagaglio,
                    v.ora_partenza, v.ora_arrivo,
                    a1.citta as partenza_citta, a2.citta as arrivo_citta
             FROM prenotazioni p
             JOIN voli v ON p.volo_id = v.id
             JOIN aeroporti a1 ON v.aeroporto_partenza_id = a1.id
             JOIN aeroporti a2 ON v.aeroporto_arrivo_id = a2.id
             WHERE p.utente_id = $1 
             ORDER BY p.data_prenotazione DESC`,
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
        const user = (req as any).user;
        const utenteId = user?.id;
        const ruolo = user?.ruolo;
        
        let query = `
            SELECT p.*, v.ora_partenza, v.ora_arrivo, v.aeroporto_partenza_id, v.aeroporto_arrivo_id,
                   u.nome as utente_nome, u.cognome as utente_cognome
            FROM prenotazioni p
            JOIN voli v ON p.volo_id = v.id
            JOIN utenti u ON p.utente_id = u.id
            WHERE p.id = $1
        `;
        let params: any[] = [id];
        
        if (user && ruolo !== 'admin') {
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
        const user = (req as any).user;
        const { volo_id, posto, classe, tipo_bagaglio, prezzo_finale, passeggeri, utente_id } = req.body;
        
        // Priority: Logged in user ID > Body utente_id > Guest (1)
        const finalUtenteId = user?.id || utente_id || 1;

        const result = await pool.query(
            `INSERT INTO prenotazioni (utente_id, volo_id, prezzo_finale, posto, classe, tipo_bagaglio)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, utente_id as passeggero_id, volo_id, data_prenotazione, prezzo_finale as prezzo, posto, classe, tipo_bagaglio`,
            [finalUtenteId, volo_id, prezzo_finale, posto, classe, tipo_bagaglio]
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

export async function ricercaPrenotazione(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, cognome } = req.query;
        
        if (!id || !cognome) {
            throw new AppError(400, "ID e cognome sono richiesti");
        }

        const query = `
            SELECT p.*, v.ora_partenza, v.ora_arrivo, v.data_partenza as volo_data_partenza,
                   a1.citta as partenza_citta, a2.citta as arrivo_citta,
                   u.nome as utente_nome, u.cognome as utente_cognome
            FROM prenotazioni p
            JOIN voli v ON p.volo_id = v.id
            JOIN aeroporti a1 ON v.aeroporto_partenza_id = a1.id
            JOIN aeroporti a2 ON v.aeroporto_arrivo_id = a2.id
            JOIN utenti u ON p.utente_id = u.id
            WHERE p.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Prenotazione non trovata");
        }
        
        const booking = result.rows[0];
        
        // Fetch passengers to check surnames too
        const passengersResult = await pool.query("SELECT * FROM passeggeri WHERE prenotazione_id = $1", [id]);
        const passengers = passengersResult.rows;

        // Verify surname (case insensitive)
        const inputSurname = (cognome as string).toLowerCase();
        const matchesUser = booking.utente_cognome.toLowerCase() === inputSurname;
        const matchesPassenger = passengers.some(p => p.cognome.toLowerCase() === inputSurname);

        if (!matchesUser && !matchesPassenger) {
            throw new AppError(404, "Prenotazione non trovata per questo cognome");
        }
        
        res.json({
            ...booking,
            passeggeri: passengers
        });
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
