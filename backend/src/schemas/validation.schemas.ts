import { z } from "zod";

export const signupSchema = z.object({
    nome: z.string().min(1),
    cognome: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    telefono: z.string().optional()
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
});

export const ricercaVoliSchema = z.object({
    aeroporto_partenza: z.number().int(),
    aeroporto_arrivo: z.number().int(),
    data_partenza: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    data_ritorno: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export const prenotazioneInputSchema = z.object({
    volo_id: z.number().int(),
    posto: z.string().min(1),
    classe: z.string().min(1),
    tipo_bagaglio: z.string().min(1)
});

export const aereoInputSchema = z.object({
    capienza: z.number().int().positive(),
    modello: z.string().min(1),
    stato: z.boolean().optional()
});
