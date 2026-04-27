import { pool } from "@/services/db.services";
import { Request, Response, NextFunction } from "express";

export async function getStatistiche(_req: Request, res: Response, next: NextFunction) {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM prenotazioni) as totale_prenotazioni,
                (SELECT COALESCE(SUM(prezzo_finale), 0) FROM prenotazioni) as ricavi_totali,
                (SELECT COUNT(*) FROM voli WHERE data_partenza >= CURRENT_DATE) as voli_attivi
        `;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function getAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query("SELECT * FROM analytics");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}
