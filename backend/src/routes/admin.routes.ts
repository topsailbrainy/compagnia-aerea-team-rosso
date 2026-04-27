import { Router } from "express";
import { getPrenotazioniAdmin } from "@/controllers/prenotazioni.controller";
import { getStatistiche, getAnalytics } from "@/controllers/admin.controller";
import { authMw, adminMw } from "@/middlewares/auth.middlewares";

const router = Router();

router.use(authMw, adminMw);

router.get("/prenotazioni", getPrenotazioniAdmin);
router.get("/statistiche", getStatistiche);
router.get("/analytics", getAnalytics);

export default router;
