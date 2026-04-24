import { z } from "zod";

const passeggeriBaseSchema = z.object({
    nome: z.string(),
    cognome: z.string(),
    email: z.email(),
    telefono: z.string(),
});

export const addPasseggeroSchema = z.object(passeggeriBaseSchema);

export const updatePasseggeroSchema = z.object({
    nome: passeggeriBaseSchema.shape.nome.optional(),
    cognome: passeggeriBaseSchema.shape.cognome.optional(),
    email: passeggeriBaseSchema.shape.email.optional(),
    telefono: passeggeriBaseSchema.shape.telefono.optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one field is required");
