require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}`, })
import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    logger: 'file',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrationsRun: false,
    migrations: [__dirname + '/../databases/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/databases/migrations',
    },
};
export = config;
