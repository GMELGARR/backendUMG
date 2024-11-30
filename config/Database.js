import { Sequelize } from "sequelize";

const db = new Sequelize('privado_umg', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db; 