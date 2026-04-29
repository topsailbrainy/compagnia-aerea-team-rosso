import { pool } from "@/services/db.services";
import { AppError } from "@/middlewares/error.middlewares";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const { nome, cognome, email, password, telefono } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            `INSERT INTO utenti (nome, cognome, email, password, telefono, ruolo)
             VALUES ($1, $2, $3, $4, $5, 'user')
             RETURNING id, nome, cognome, email, ruolo`,
            [nome, cognome, email, hashedPassword, telefono]
        );
        
        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, email: user.email, ruolo: user.ruolo },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        res.status(201).json({ token, user });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query(
            "SELECT * FROM utenti WHERE email = $1",
            [email]
        );
        
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(401, "Credenziali non valide");
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, ruolo: user.ruolo },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
}

export async function logout(_req: Request, res: Response) {
    res.status(204).send();
}
