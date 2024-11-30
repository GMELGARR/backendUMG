// routes/TestRoute.js
import express from "express";
import {
    getAllTests,    
    runProjectTests,
    getTestHistory
} from "../controllers/TestController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log('Ruta accedida:', req.method, req.path);
    next();
});

// Rutas para tests
router.post('/projects/:projectId/tests', verifyUser, runProjectTests);
router.get('/projects/:projectId/tests', verifyUser, getTestHistory);
router.get('/tests', verifyUser, getAllTests);
router.post('/tests/run/:projectId', verifyUser, runProjectTests);

export default router;