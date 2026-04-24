import { z } from "zod";

const voloBaseSchema = z.object({
    aeroporto_partenza_id: z.uuid(),
    aeroporto_arrivo_id: z.uuid(),
    data_partenza: z.string(),
    data_arrivo: z.string(),
    ora_partenza: z.string(),
    ora_arrivo: z.string(),
});

export const addVoloSchema = z.object(voloBaseSchema);

export const updateVoloSchema = z.object({
    aeroporto_partenza_id: voloBaseSchema.shape.aeroporto_partenza_id.optional(),
    aeroporto_arrivo_id: voloBaseSchema.shape.aeroporto_arrivo_id.optional(),
    data_partenza: voloBaseSchema.shape.data_partenza.optional(),
    data_arrivo: voloBaseSchema.shape.data_arrivo.optional(),
    ora_partenza: voloBaseSchema.shape.ora_partenza.optional(),
    ora_arrivo: voloBaseSchema.shape.ora_arrivo.optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one field is required");