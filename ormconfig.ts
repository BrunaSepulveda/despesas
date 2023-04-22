import { ConnectionOptions } from 'typeorm';

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: `.env` });

const ormconfig: ConnectionOptions = {
  cli: {
    migrationsDir: path.join('src', 'migrations'),
  },
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  migrationsTableName: 'database_migrations',
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  type: 'postgres',
  username: process.env.DB_USERNAME,
  migrationsRun: process.env.NODE_ENV !== 'test',
  migrations: [path.join(__dirname, 'src', 'migrations', '*')],
};

export default ormconfig;
