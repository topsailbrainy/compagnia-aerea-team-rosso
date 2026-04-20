import 'dotenv/config';
import app from './app';

// Porta di ascolto
const port = Number(process.env.PORT ?? 3000);

// Avvio server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

