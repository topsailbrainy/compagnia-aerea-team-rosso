import { Router } from "express";
import { getPrenotazioniUser, getPrenotazioneById, createPrenotazione, ricercaPrenotazione } from "@/controllers/prenotazioni.controller";
import { authMw } from "@/middlewares/auth.middlewares";
import { validationMw } from "@/middlewares/validation.middlewares";
import { prenotazioneInputSchema } from "@/schemas/validation.schemas";

const router = Router();

router.get("/search", ricercaPrenotazione);

router.use(authMw);

router.get("/", getPrenotazioniUser);
router.get("/:id", getPrenotazioneById);
router.post("/", createPrenotazione);

export default router;


