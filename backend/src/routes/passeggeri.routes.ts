import { Router } from "express";
import { passeggeriGET, passeggeriPOST, passeggeriPUT, passeggeriDELETE } from "@/controllers/passeggeri.controller";
import { validationMw } from "@/middlewares/validation.middlewares";
 
const router = Router();

router.get("/", passeggeriGET);
router.post("/", passeggeriPOST);
router.put("/", passeggeriPUT);
router.delete("/:id", passeggeriDELETE);



export default router;