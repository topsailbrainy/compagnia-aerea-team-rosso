import { z } from "zod";

export const addPasseggeroSchema = z.object({
    nome: z.string().min(2),
    cognome: z.string().min(2),
    email: z.email(),
    telefono: z.string().min(5),
});

export const updatePasseggeroSchema = z.object({
    id: z.coerce.number(),
    nome: z.string().min(2).optional(),
    cognome: z.string().min(2).optional(),
    email: z.email().optional(),
    telefono: z.string().min(5).optional(),
}).refine((data) => Object.keys(data).length > 1, "At least one field to update is required");
