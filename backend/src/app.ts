import express from 'express';
import { httpLogger } from '@/services/logger.services';
import { errorMw } from '@/middlewares/error.middlewares';

import authRoutes from '@/routes/auth.routes';
import aeroportiRoutes from '@/routes/aeroporti.routes';
import voliRoutes from '@/routes/voli.routes';
import prenotazioniRoutes from '@/routes/prenotazioni.routes';
import adminRoutes from '@/routes/admin.routes';
import aereiRoutes from '@/routes/aerei.routes';
import passeggeriRoutes from '@/routes/passeggeri.routes';

const app = express();

app.use(httpLogger);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/aeroporti", aeroportiRoutes);
app.use("/voli", voliRoutes);
app.use("/prenotazioni", prenotazioniRoutes);
app.use("/admin", adminRoutes);
app.use("/aerei", aereiRoutes);
app.use("/passeggeri", passeggeriRoutes);

app.use(errorMw);

export default app;
