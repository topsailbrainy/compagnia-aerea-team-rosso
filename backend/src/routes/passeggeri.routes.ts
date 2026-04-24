import { Router } from "express";
import { passeggeriGET, passeggeriPOST, passeggeriPUT, passeggeriDELETE } from "@/controllers/passeggeri.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { addPasseggeroSchema, updatePasseggeroSchema } from "@/schemas/passeggeri.schemas";
import { authMw, adminMw } from "@/middlewares/auth.middlewares";
 
const router = Router();

router.use(authMw, adminMw); // Supponiamo che queste rotte siano per admin come in utenti.routes

router.get("/", passeggeriGET);
router.post("/", validationMw({ body: addPasseggeroSchema }), passeggeriPOST);

router.put("/:id", validationMw({ body: updatePasseggeroSchema }), passeggeriPUT);
router.delete("/:id", passeggeriDELETE);

export default router;