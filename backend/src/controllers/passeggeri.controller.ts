import { Request, Response, NextFunction } from "express";
import { pool } from "@/services/db.services";
import bcrypt from "bcrypt";

export const passeggeriGET = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await pool.query("SELECT id, nome, cognome, email, telefono, ruolo FROM utenti");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const passeggeriPOST = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nome, cognome, email, telefono, password } = req.body;
        const hashedPassword = await bcrypt.hash(password ?? 'password123', 10);
        
        const result = await pool.query(
            "INSERT INTO utenti (nome, cognome, email, telefono, password, ruolo) VALUES ($1, $2, $3, $4, $5, 'user') RETURNING id, nome, cognome, email, telefono, ruolo",
            [nome, cognome, email, telefono, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const passeggeriPUT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { nome, cognome, email, telefono } = req.body;
        const result = await pool.query(
            "UPDATE utenti SET nome = COALESCE($1, nome), cognome = COALESCE($2, cognome), email = COALESCE($3, email), telefono = COALESCE($4, telefono) WHERE id = $5 RETURNING id, nome, cognome, email, telefono, ruolo",
            [nome, cognome, email, telefono, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Passeggero non trovato" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const passeggeriDELETE = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM utenti WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Passeggero non trovato" });
        }
        res.json({ message: "Passeggero eliminato con successo" });
    } catch (error) {
        next(error);
    }
};
