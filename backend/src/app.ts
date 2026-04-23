import express from "express";
import { errorMw } from "@/middlewares/error.middlewares";
import { httpLogger } from "@/services/logger.services";
import passeggeriRoutes from "@/routes/passeggeri.routes";
import voliRoutes from "@/routes/voli.routes";
import prenotazioniRoutes from "@/routes/prenotazioni.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(httpLogger);

// Routes
app.use("/passeggeri", passeggeriRoutes);
app.use("/voli", voliRoutes);
app.use("/prenotazioni", prenotazioniRoutes);

// Error handling
app.use(errorMw);

export default app;
