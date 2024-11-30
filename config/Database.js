import { Sequelize } from "sequelize";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mysql2 = require('mysql2');

const db = new Sequelize(
  process.env.DB_NAME || 'privado_umg',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '', 
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    dialectModule: mysql2,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default db;