/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const srcPath = path.resolve(__dirname, 'src');

const ormconfig: any = {
  cli: {
    migrationsDir: path.join('src', 'migrations'),
    extra: {
      uuidExtension: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    },
  },
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  migrationsTableName: 'database_migrations',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  type: 'postgres',
  username: process.env.DB_USERNAME,
  migrationsRun: process.env.NODE_ENV !== 'test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, 'src', 'migrations', '*')],
};

export default ormconfig;
