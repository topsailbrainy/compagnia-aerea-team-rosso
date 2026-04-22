import { Router } from "express";
import { getUsers, createUser } from "../../controllers/users.controller";

const router = Router();

// Endpoint GET /users
router.get("/", getUsers);  

// Endpoint POST /users
router.post("/", createUser);   

export default router;