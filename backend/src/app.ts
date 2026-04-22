// Importo il framework 
import express from 'express';
import userRoutes from '@/routes/passeggeri.routes'; // Importo le rotte degli utenti
import productRoutes from '@/routes/products.routes'; // Importo le rotte dei prodotti


// Creazione del app
const app = express();

// Middleware per leggere JSON (req.body)
app.use(express.json());

// Definisco le rotte
app.get("/utenti", userRoutes);
app.use("/products", productRoutes);

export default app;
