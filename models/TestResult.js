// models/TestResult.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Projects from "./ProjectModel.js";

const { DataTypes } = Sequelize;

const TestResult = db.define('test_result', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Resultado general del test
    status: {
        type: DataTypes.ENUM,
        values: ['SUCCESS', 'FAILED', 'ERROR'],
        allowNull: false
    },
    // Métricas clave
    codeQuality: {
        type: DataTypes.JSON,
        allowNull: true,
        // Almacenará datos como:
        // - complejidad ciclomática
        // - duplicación de código
        // - cobertura de código
    },
    securityIssues: {
        type: DataTypes.JSON,
        allowNull: true,
        // Almacenará vulnerabilidades encontradas
    },
    performanceMetrics: {
        type: DataTypes.JSON,
        allowNull: true,
        // Métricas de rendimiento
    },
    testSummary: {
        type: DataTypes.JSON,
        allowNull: true,
        // Resumen de pruebas unitarias/integración
    },
    // Detalles de la ejecución
    executionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    commitInfo: {
        type: DataTypes.JSON,
        allowNull: true
        // Información del commit analizado
    },
    executionLogs: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Projects.hasMany(TestResult);
TestResult.belongsTo(Projects, { foreignKey: 'projectId' });
as: 'Project'  // Importante: define el alias

export default TestResult;