import { z } from "zod";

export const idParamsSchema = z.object({
    id: z.uuid(),
});

export const voloIdParamsSchema = z.object({
    volo_id: z.uuid(),
});

export const aereoIdParamsSchema = z.object({
    aereo_id: z.uuid(),
});

export const aeroportoIdParamsSchema = z.object({
    aeroporto_id: z.uuid(),
});

export const gateIdParamsSchema = z.object({
    gate_id: z.uuid(),
});

export const trattaIdParamsSchema = z.object({
    tratta_id: z.uuid(),
});

export const prenotazioneIdParamsSchema = z.object({
    prenotazione_id: z.uuid(),
});

export const passeggeroIdParamsSchema = z.object({
    passeggero_id: z.uuid(),
});

