import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Passeggero } from "@/dtos/entities.types";
import { Request, Response } from "express";
import { buildUpdateQuery } from "@/utils/sql.utils";

export async function passeggeriGET(_req: Request, res: Response) {
    const results = await pool.query<Passeggero>(`
        SELECT * FROM passeggeri
        ORDER BY cognome ASC
    `)
    res.json(results.rows)
}

export async function passeggeriPOST(req: Request, res: Response) {
    const { nome, cognome, email, telefono } = req.body;
    const results = await pool.query<Passeggero>(`
        INSERT INTO passeggeri (nome, cognome, email, telefono)
        VALUES ($1, $2, $3, $4)
        RETURNING *  
    `, [nome, cognome, email, telefono])
    res.status(201).json(results.rows[0])
}

export async function passeggeriPUT(req: Request, res: Response) {
    const { id, ...data } = req.body;

    await ensurePasseggeroExists(id);

    const { text, values } = buildUpdateQuery({
        table: "passeggeri",
        idColumn: "id",
        idValue: id,
        data,
        returning: "*"
    });

    const results = await pool.query<Passeggero>(text, values);
    res.status(200).json(results.rows[0])
}

export async function passeggeriDELETE(req: Request, res: Response) {
    const { id } = req.params;
    const results = await pool.query<Passeggero>(`
        DELETE FROM passeggeri
        WHERE id = $1
        RETURNING *  
    `, [id])

    if (results.rows.length === 0) {
        throw new AppError(404, "Passeggero non trovato")
    }

    res.status(200).json(results.rows[0])
}

export async function ensurePasseggeroExists(id: number) {
    const result = await pool.query<Passeggero>(`
        SELECT * FROM passeggeri
        WHERE id = $1
    `, [id])
    if (result.rows.length === 0) {
        throw new AppError(404, "Passeggero non trovato")
    }
    return result.rows[0]
}
