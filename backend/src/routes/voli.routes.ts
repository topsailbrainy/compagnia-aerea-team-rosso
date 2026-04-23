import { Router } from "express";
import { voliGET, voliPOST, voliPUT, voliDELETE } from "@/controllers/voli.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
import { addVoloSchema, updateVoloSchema } from "@/schemas/voli.schemas";
import { idParamsSchema } from "@/schemas/common.schemas";
 
const router = Router();

router.get("/", voliGET);
router.post("/", validationMw({body: addVoloSchema}), voliPOST);
router.put("/", validationMw({body: updateVoloSchema}), voliPUT);
router.delete("/:id", validationMw({params: idParamsSchema}), voliDELETE);

export default router;
