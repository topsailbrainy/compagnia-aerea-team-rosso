import { Router } from "express";
import { prenotazioniGET, prenotazioniPOST, prenotazioniPUT, prenotazioniDELETE } from "@/controllers/prenotazioni.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { addPrenotazioneSchema, updatePrenotazioneSchema } from "@/schemas/prenotazioni.schemas";
import { idParamsSchema } from "@/schemas/common.schemas";
 
const router = Router();

router.get("/", prenotazioniGET);
router.post("/", validationMw({body: addPrenotazioneSchema}), prenotazioniPOST);
router.put("/", validationMw({body: updatePrenotazioneSchema}), prenotazioniPUT);
router.delete("/:id", validationMw({params: idParamsSchema}), prenotazioniDELETE);

export default router;
