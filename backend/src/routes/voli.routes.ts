import { Router } from "express";
import { ricercaVoli, getVoloById, getAllVoli, createVolo, updateVolo, deleteVolo } from "@/controllers/voli.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { ricercaVoliSchema } from "@/schemas/validation.schemas";
import { addVoloSchema, updateVoloSchema } from "@/schemas/voli.schemas";
import { authMw, adminMw } from "@/middlewares/auth.middlewares";

const router = Router();

// Public routes
router.post("/ricerca", validationMw({ body: ricercaVoliSchema }), ricercaVoli);
router.get("/:id", getVoloById);

// Admin routes
router.get("/", /*authMw, adminMw,*/ getAllVoli);
router.post("/", authMw, adminMw, validationMw({ body: addVoloSchema }), createVolo);
router.patch("/:id", authMw, adminMw, validationMw({ body: updateVoloSchema }), updateVolo);
router.delete("/:id", authMw, adminMw, deleteVolo);

export default router;

