import {Pool} from "pg";
import {logger} from "@/services/logger.services";

export const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
});

pool.on("connect", () => {
    logger.info("Database connected");
});

pool.on("error", (error) => {
    logger.error(error, "Database error");
});
