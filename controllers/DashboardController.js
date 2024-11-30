// controllers/DashboardController.js
import TestResult from '../models/TestResult.js';
import Project from '../models/ProjectModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        const activeProjects = await Project.count({ where: { estado: 'activo' } });
        const totalTests = await TestResult.count();
        const successTests = await TestResult.count({ where: { status: 'SUCCESS' } });
        const successRate = totalTests > 0 ? (successTests / totalTests) * 100 : 0;
        
        const recentActivity = await TestResult.findAll({
            include: [{ model: Project, attributes: ['name'] }],
            order: [['executionDate', 'DESC']],
            limit: 5
        });

        res.json({
            activeProjects,
            totalTests,
            successRate,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};