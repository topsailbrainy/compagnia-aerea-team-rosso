import { z } from "zod";

const voloBaseSchema = z.object({
    aeroporto_partenza_id: z.number().int(),
    aeroporto_arrivo_id: z.number().int(),
    aereo_id: z.number().int(),
    data_partenza: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    data_arrivo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    ora_partenza: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    ora_arrivo: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    prezzo_base: z.number().positive(),
    stato: z.enum(['On Time', 'Delayed', 'Scheduled', 'Departed']).default('Scheduled'),
});

export const addVoloSchema = z.object(voloBaseSchema);

export const updateVoloSchema = z.object({
    aeroporto_partenza_id: voloBaseSchema.shape.aeroporto_partenza_id.optional(),
    aeroporto_arrivo_id: voloBaseSchema.shape.aeroporto_arrivo_id.optional(),
    aereo_id: voloBaseSchema.shape.aereo_id.optional(),
    data_partenza: voloBaseSchema.shape.data_partenza.optional(),
    data_arrivo: voloBaseSchema.shape.data_arrivo.optional(),
    ora_partenza: voloBaseSchema.shape.ora_partenza.optional(),
    ora_arrivo: voloBaseSchema.shape.ora_arrivo.optional(),
    prezzo_base: voloBaseSchema.shape.prezzo_base.optional(),
    stato: voloBaseSchema.shape.stato.optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one field is required");
