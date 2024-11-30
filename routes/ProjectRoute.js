import express from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    searchProjects
} from "../controllers/Projects.js";
import { verifyUser} from "../middleware/AuthUser.js";

const router = express.Router();

// Ruta para obtener todos los proyectos, solo accesible para todos los usuarios.
router.get('/projects', verifyUser, getProjects); //veryfyUser resguarda la ruta que haya un login iniciado para operar.

// Ruta para obtener un Proyecto por ID, 
router.get('/projects/:id', verifyUser, getProjectById);

// Ruta para crear un nuevo proyecto, solo accesible por administradores
router.post('/projects',verifyUser, createProject);

// Ruta para actualizar un proyecto existente, solo accesible por administradores
router.patch('/projects/:id', verifyUser, updateProject);

// Ruta para eliminar un proyecto, solo accesible por administradores
router.delete('/projects/:id', verifyUser, deleteProject);

router.get('/projects/search', verifyUser, searchProjects);

export default router;
