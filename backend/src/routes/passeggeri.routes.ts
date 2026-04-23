import { Router } from "express";
import { passeggeriGET, passeggeriPOST, passeggeriPUT, passeggeriDELETE } from "@/controllers/passeggeri.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { addPasseggeroSchema, updatePasseggeroSchema } from "@/schemas/passeggeri.schemas";
import { idParamsSchema } from "@/schemas/common.schemas";
 
const router = Router();

router.get("/", passeggeriGET);
router.post("/", validationMw({body: addPasseggeroSchema}), passeggeriPOST);
router.put("/", validationMw({body: updatePasseggeroSchema}), passeggeriPUT);
router.delete("/:id", validationMw({params: idParamsSchema}), passeggeriDELETE);

export default router;