import { Router } from "express";
import { signup, login, logout, deleteAccount } from "@/controllers/auth.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { signupSchema, loginSchema } from "@/schemas/validation.schemas";
import { authMw } from "@/middlewares/auth.middlewares";

const router = Router();

router.post("/signup", validationMw({ body: signupSchema }), signup);
router.post("/login", validationMw({ body: loginSchema }), login);
router.post("/logout", logout);
router.delete("/delete-account", authMw, deleteAccount);

export default router;
