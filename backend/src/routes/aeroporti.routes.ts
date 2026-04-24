import { Router } from "express";
import { getAeroporti } from "@/controllers/aeroporti.controller";

const router = Router();

router.get("/", getAeroporti);

export default router;
