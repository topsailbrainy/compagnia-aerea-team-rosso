import { z } from "zod";

export const addPrenotazioneSchema = z.object({
    passeggero_id: z.coerce.number(),
    volo_id: z.coerce.number(),
    data_prenotazione: z.string(),
    prezzo: z.number(),
    posto: z.string(),
    classe: z.string(),
    tipo_bagaglio: z.string(),
});

export const updatePrenotazioneSchema = z.object({
    id: z.coerce.number(),
    passeggero_id: z.coerce.number().optional(),
    volo_id: z.coerce.number().optional(),
    data_prenotazione: z.string().optional(),
    prezzo: z.number().optional(),
    posto: z.string().optional(),
    classe: z.string().optional(),
    tipo_bagaglio: z.string().optional(),
}).refine((data) => Object.keys(data).length > 1, "At least one field to update is required");
