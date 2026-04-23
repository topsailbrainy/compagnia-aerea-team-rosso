import { z } from "zod";

export const addPrenotazioneSchema = z.object({
    passeggero_id: z.uuid(),
    volo_id: z.uuid(),
    data_prenotazione: z.string(),
    prezzo: z.number(),
    posto: z.string(),
    classe: z.string(),
    tipo_bagaglio: z.string(),
});

export const updatePrenotazioneSchema = z.object({
    id: z.uuid(),
    passeggero_id: z.uuid().optional(),
    volo_id: z.uuid().optional(),
    data_prenotazione: z.string().optional(),
    prezzo: z.number().optional(),
    posto: z.string().optional(),
    classe: z.string().optional(),
    tipo_bagaglio: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one field is required");