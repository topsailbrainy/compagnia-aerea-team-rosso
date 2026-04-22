import { Request, Response } from "express";
import * as bookingService from "../services/prenotazioni.service";

export const getBookings = async (req: Request, res: Response) => {
    const bookings = await bookingService.getBookings();
    res.json(bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
};

export const createBooking = async (req: Request, res: Response) => {
    const newBooking = await bookingService.createBooking(req.body);
    res.status(201).json(newBooking);
};