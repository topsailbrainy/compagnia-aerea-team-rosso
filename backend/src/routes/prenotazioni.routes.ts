import { Router } from "express";
import { getPrenotazioniUser, getPrenotazioneById, createPrenotazione } from "@/controllers/prenotazioni.controller";
import { authMw } from "@/middlewares/auth.middlewares";
import { validationMw } from "@/middlewares/validation.middlewares";
import { prenotazioneInputSchema } from "@/schemas/validation.schemas";

const router = Router();

//router.use(authMw);

router.get("/", authMw, getPrenotazioniUser);
router.get("/:id", authMw, getPrenotazioneById);
router.post("/", createPrenotazione);

export default router;


