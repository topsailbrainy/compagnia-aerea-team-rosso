import { Router } from "express";
import { getAerei, getAereoById, createAereo, deleteAereo } from "@/controllers/aerei.controller";
import { authMw, adminMw } from "@/middlewares/auth.middlewares";
import { validationMw } from "@/middlewares/validation.middlewares";
import { aereoInputSchema } from "@/schemas/validation.schemas";

const router = Router();

router.use(authMw, adminMw);

router.get("/", getAerei);
router.get("/:id", getAereoById);
router.post("/", validationMw({ body: aereoInputSchema }), createAereo);
router.delete("/:id", deleteAereo);

export default router;
