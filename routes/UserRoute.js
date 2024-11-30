import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Ruta para obtener todos los usuarios activos, solo accesible por administradores
router.get('/users', verifyUser, adminOnly, getUsers);

// Ruta para obtener un usuario activo por ID, solo accesible por administradores
router.get('/users/:id', verifyUser, adminOnly,getUserById);

// Ruta para crear un nuevo usuario, solo accesible por administradores
router.post('/users', verifyUser, adminOnly, createUser);

// Ruta para actualizar un usuario existente, solo accesible por administradores
router.patch('/users/:id',verifyUser, adminOnly, updateUser);

// Ruta para desactivar un usuario (en lugar de eliminarlo), solo accesible por administradores
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

router.patch('/users/toggle/:id', verifyUser, adminOnly, toggleUserStatus);

export default router;
