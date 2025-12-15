import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "192.168.29.13",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: false,
    migrationsRun: false,
    entities: [
        path.join(__dirname, "../entities/**/*.{ts,js}")
    ]
});
