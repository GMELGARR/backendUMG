import { exec } from 'child_process';
import util from 'util';
import Project from '../models/ProjectModel.js';
import TestResult from '../models/TestResult.js';
import { analyzeRepository } from '../utils/repositoryAnalyzer.js';

const execAsync = util.promisify(exec);

class TestAutomationService {
    async runTestsForProject(projectId) {
        try {
            const project = await Project.findOne({
                where: { id: projectId }
            });

            if (!project.repositoryUrl) {
                throw new Error('No repository URL found for project');
            }

            // Analizar el repositorio
            const analysisResult = await analyzeRepository(project.repositoryUrl);

            // Guardar resultados
            const testResult = await TestResult.create({
                projectId: project.id,
                status: analysisResult.status,
                codeQuality: analysisResult.codeQuality,
                securityIssues: analysisResult.security,
                performanceMetrics: analysisResult.performance,
                testSummary: analysisResult.tests,
                commitInfo: analysisResult.commitInfo,
                executionLogs: analysisResult.logs
            });

            return testResult;
        } catch (error) {
            console.error('Error in test automation:', error);
            throw error;
        }
    }

    // Programar tests automáticos
    async scheduleTests(projectId, frequency = '24h') {
        // Implementar lógica de programación
    }

    // Obtener historial de tests
    async getTestHistory(projectId) {
        return await TestResult.findAll({
            where: { projectId },
            order: [['executionDate', 'DESC']]
        });
    }
}

export default new TestAutomationService();