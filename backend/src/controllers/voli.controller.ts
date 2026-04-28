import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";

export async function ricercaVoli(req: Request, res: Response, next: NextFunction) {
    try {
        const { aeroporto_partenza, aeroporto_arrivo, data_partenza } = req.body;
        
        const result = await pool.query(
            `SELECT v.*, 
             ap.nome as partenza_nome, ap.citta as partenza_citta,
             aa.nome as arrivo_nome, aa.citta as arrivo_citta,
             ae.modello as aereo_modello, ae.capienza as aereo_capienza
             FROM voli v
             JOIN aeroporti ap ON v.aeroporto_partenza_id = ap.id
             JOIN aeroporti aa ON v.aeroporto_arrivo_id = aa.id
             JOIN aerei ae ON v.aereo_id = ae.id
             WHERE v.aeroporto_partenza_id = $1 
             AND v.aeroporto_arrivo_id = $2 
             AND v.data_partenza = $3`,
            [aeroporto_partenza, aeroporto_arrivo, data_partenza]
        );
        
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function getVoloById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT v.*, 
             ap.nome as partenza_nome, ap.citta as partenza_citta,
             aa.nome as arrivo_nome, aa.citta as arrivo_citta,
             ae.modello as aereo_modello, ae.capienza as aereo_capienza
             FROM voli v
             JOIN aeroporti ap ON v.aeroporto_partenza_id = ap.id
             JOIN aeroporti aa ON v.aeroporto_arrivo_id = aa.id
             JOIN aerei ae ON v.aereo_id = ae.id
             WHERE v.id = $1`, 
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new AppError(404, "Volo non trovato");
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function getAllVoli(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query(
            `SELECT v.*, 
             ap.nome as partenza_nome, ap.citta as partenza_citta,
             aa.nome as arrivo_nome, aa.citta as arrivo_citta,
             ae.modello as aereo_modello
             FROM voli v
             JOIN aeroporti ap ON v.aeroporto_partenza_id = ap.id
             JOIN aeroporti aa ON v.aeroporto_arrivo_id = aa.id
             JOIN aerei ae ON v.aereo_id = ae.id
             ORDER BY v.data_partenza DESC, v.ora_partenza DESC`
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function createVolo(req: Request, res: Response, next: NextFunction) {
    try {
        const { aeroporto_partenza_id, aeroporto_arrivo_id, aereo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo, prezzo_base, stato } = req.body;
        const result = await pool.query(
            `INSERT INTO voli (aeroporto_partenza_id, aeroporto_arrivo_id, aereo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo, prezzo_base, stato)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [aeroporto_partenza_id, aeroporto_arrivo_id, aereo_id, data_partenza, data_arrivo, ora_partenza, ora_arrivo, prezzo_base, stato || 'Scheduled']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function updateVolo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const fields = req.body;
        const keys = Object.keys(fields);
        if (keys.length === 0) throw new AppError(400, "Nessun campo da aggiornare");

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const values = Object.values(fields);
        
        const result = await pool.query(
            `UPDATE voli SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) throw new AppError(404, "Volo non trovato");
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function deleteVolo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM voli WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) throw new AppError(404, "Volo non trovato");
        res.json({ message: "Volo eliminato con successo" });
    } catch (error) {
        next(error);
    }
}
