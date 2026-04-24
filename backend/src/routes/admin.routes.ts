import { Router } from "express";
import { getPrenotazioniAdmin } from "@/controllers/prenotazioni.controller";
import { getStatistiche } from "@/controllers/admin.controller";
import { authMw, adminMw } from "@/middlewares/auth.middlewares";

const router = Router();

router.use(authMw, adminMw);

router.get("/prenotazioni", getPrenotazioniAdmin);
router.get("/statistiche", getStatistiche);

export default router;
