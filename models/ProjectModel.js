import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Projects = db.define('project', {
    uuid: {
        type: DataTypes.STRING, 
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.TEXT, // Cambiado a TEXT
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    technologies: {
        type: DataTypes.JSON, // Cambiado a JSON para almacenar múltiples tecnologías
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    fechaInicio: {
        type: DataTypes.DATE, // Cambiado a DATE
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    fechaEstimacion: {
        type: DataTypes.DATE, // Cambiado a DATE
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    repositoryUrl: {
        type: DataTypes.STRING, // Se usa STRING para almacenar la URL
        allowNull: true, // Puede ser nulo si no se proporciona
        validate: {
            isUrl: {
                msg: "Debe ser una URL válida"
            }
        }
    },
    estado: {
        type: DataTypes.STRING, // Cambiado a STRING para representar estados
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Projects);
Projects.belongsTo(Users, { foreignKey: 'userId' });

export default Projects;
