import { Router } from "express";
import { signup, login, logout } from "@/controllers/auth.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { signupSchema, loginSchema } from "@/schemas/validation.schemas";

const router = Router();

router.post("/signup", validationMw({ body: signupSchema }), signup);
router.post("/login", validationMw({ body: loginSchema }), login);
router.post("/logout", logout);

export default router;
