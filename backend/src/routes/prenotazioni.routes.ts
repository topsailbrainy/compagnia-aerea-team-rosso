import { Router } from "express";
import {
    getBookings,
    getBookingById,
    createBooking
} from "../controllers/prenotazioni.controller";

const router = Router();

// GET /prenotazioni
router.get("/", getBookings);

// GET /prenotazioni/:id
router.get("/:id", getBookingById);

// POST /prenotazioni
router.post("/", createBooking);

export default router;