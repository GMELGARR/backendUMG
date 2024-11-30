import TestResult from '../models/TestResult.js';
import Project from '../models/ProjectModel.js';
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomHash = () => {
    const chars = '0123456789abcdef';
    return Array.from({length: 7}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const getRandomComplexity = () => {
    const complexities = ['low', 'medium', 'high'];
    return complexities[Math.floor(Math.random() * complexities.length)];
};

export const getAllTests = async (req, res) => {
    try {
        console.log("Iniciando búsqueda de tests...");

        const tests = await TestResult.findAll({
            include: [{
                model: Project,
                attributes: ['name', 'uuid']
            }],
            order: [['executionDate', 'DESC']],
        });
        
        res.status(200).json(tests);
    } catch (error) {
        console.error("Error al obtener pruebas:", error);
        res.status(500).json({ msg: "Error al cargar las pruebas" });
    }
};

export const runProjectTests = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log("Ejecutando test para proyecto:", projectId);

        const project = await Project.findOne({
            where: { uuid: projectId }
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // Generar números base aleatorios
        const totalTests = getRandomInt(8, 20);
        const failedTests = getRandomInt(0, Math.floor(totalTests * 0.3));
        const passedTests = totalTests - failedTests;
        const coverage = getRandomInt(60, 98);
        const linesOfCode = getRandomInt(100, 500);
        const duplication = getRandomInt(1, 15);

        // Generar problemas de seguridad aleatorios
        const securityHigh = getRandomInt(0, 3);
        const securityMed = getRandomInt(0, 5);
        const securityLow = getRandomInt(0, 8);

        // Generar métricas de rendimiento aleatorias
        const responseTime = getRandomInt(80, 200);
        const memoryUsage = getRandomInt(128, 512);
        const cpuUsage = getRandomInt(20, 80);
        const loadTime = (Math.random() * 2 + 0.5).toFixed(1);

        // Determinar estado basado en las métricas
        const isSuccess = failedTests === 0 && securityHigh === 0 && coverage > 70;
        const status = isSuccess ? 'SUCCESS' : 'FAILED';

        // Crear resultado de prueba con datos variables
        const testResult = await TestResult.create({
            projectId: project.id,
            status: status,
            codeQuality: {
                linesOfCode: linesOfCode,
                complexity: getRandomComplexity(),
                duplications: `${duplication}%`
            },
            securityIssues: {
                high: securityHigh,
                medium: securityMed,
                low: securityLow
            },
            performanceMetrics: {
                responseTime: `${responseTime}ms`,
                throughput: `${getRandomInt(800, 1200)} req/sec`,
                memoryUsage: `${memoryUsage}MB`,
                cpuUtilization: `${cpuUsage}%`,
                loadTime: `${loadTime}s`
            },
            testSummary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                coverage: `${coverage}%`
            },
            executionLogs: `Test ${status === 'SUCCESS' ? 'ejecutado exitosamente' : 'completado con errores'} -
                ${securityHigh > 0 ? `Se detectaron ${securityHigh} problemas de seguridad críticos. ` : ''}
                ${failedTests > 0 ? `Fallaron ${failedTests} pruebas. ` : ''}
                Análisis de código completado con ${coverage}% de cobertura.
                ${duplication > 10 ? 'Se detectó un alto nivel de código duplicado. ' : ''}
                Tiempo de respuesta promedio: ${responseTime}ms.`,
            commitInfo: {
                hash: generateRandomHash(),
                branch: Math.random() > 0.2 ? 'main' : ['develop', 'feature/test', 'hotfix'][getRandomInt(0, 2)],
                author: ['Sistema', 'CI/CD', 'Jenkins', 'GitHub Actions'][getRandomInt(0, 3)],
                timestamp: new Date()
            }
        });

        res.status(200).json({
            msg: `Test ejecutado ${status === 'SUCCESS' ? 'exitosamente' : 'con errores'}`,
            testResult
        });

    } catch (error) {
        console.error("Error ejecutando test:", error);
        res.status(500).json({
            msg: "Error al ejecutar el test",
            error: error.message
        });
    }
};

export const getTestHistory = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            where: {
                uuid: projectId
            }
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        const tests = await TestResult.findAll({
            include: [{
                model: Project,
                attributes: ['name', 'uuid'],
                required: true // Esto fuerza el INNER JOIN
            }],
            order: [['executionDate', 'DESC']]
        });

        res.status(200).json(tests);

    } catch (error) {
        console.error("Error obteniendo historial:", error);
        res.status(500).json({
            msg: "Error al obtener historial",
            error: error.message
        });
    }
};

export default {
    getAllTests,
    runProjectTests,
    getTestHistory
};