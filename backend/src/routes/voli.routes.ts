import { Router } from "express";
import { ricercaVoli, getVoloById } from "@/controllers/voli.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { ricercaVoliSchema } from "@/schemas/validation.schemas";

const router = Router();

router.post("/ricerca", validationMw({ body: ricercaVoliSchema }), ricercaVoli);
router.get("/:id", getVoloById);

export default router;
