import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios activos
export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
           // atributes: ['uuid', 'name', 'username', 'role', 'isaActive'],  //para mostrar unicamente campos especificos
            //where: { isActive: true } // Filtra solo usuarios activos
        });
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Obtener un usuario activo por ID
export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                uuid: req.params.id,
                isActive: true // Filtra solo usuarios activos
            },
        });
        if (!response) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Crear un nuevo usuario con validación de unicidad en username
export const createUser = async (req, res) => {
    const { name, username, password, confPassword, role } = req.body;

    // Validaciones
    if (!name || !username || !password || !role) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Las contraseñas no coinciden" });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    
    try {
        const newUser = await User.create({
            name,
            username,
            password: hashPassword,
            role,
        });
        res.status(201).json({ msg: "Registro exitoso", user: newUser });
    } catch (error) {
        // Verifica si el error es de unicidad en el username
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).json({ msg: "El nombre de usuario ya existe" });
        } else {
            console.error("Error creando usuario:", error);
            res.status(500).json({ msg: "Error del servidor" });
        }
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id,
            isActive: true // Verifica que el usuario esté activo
        }
    });
    if (!user) return res.status(404).json({ msg: "Usuario no existe" });

    const { name, username, password, confPassword, role } = req.body;
    let hashPassword;

    if (!password) {
        hashPassword = user.password; // Mantiene la contraseña actual si no se proporciona una nueva
    } else {
        if (password !== confPassword) {
            return res.status(400).json({ msg: "Las contraseñas no coinciden" });
        }
        hashPassword = await bcrypt.hash(password, 10);
    }

    try {
        await User.update(
            {
                name,
                username,
                password: hashPassword,
                role,
            },
            {
                where: { uuid: req.params.id }
            }
        );
        res.status(200).json({ msg: "Usuario actualizado" });
    } catch (error) {
        // Verifica si el error es de unicidad en el username durante la actualización
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).json({ msg: "El nombre de usuario ya existe" });
        } else {
            console.error("Error actualizando usuario:", error);
            res.status(400).json({ msg: error.message });
        }
    }
};

// Desactivar un usuario en lugar de eliminarlo
export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id,
            isActive: true // Solo usuarios activos pueden desactivarse
        }
    });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    try {
        await User.update(
            { isActive: false }, // Desactiva el usuario
            { where: { uuid: req.params.id } }
        );
        res.status(200).json({ msg: "Usuario desactivado" });
    } catch (error) {
        console.error("Error desactivando usuario:", error);
        res.status(400).json({ msg: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
        
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        await User.update(
            { isActive: !user.isActive }, // Cambia el estado actual al opuesto
            { where: { uuid: req.params.id } }
        );
        
        res.status(200).json({ 
            msg: user.isActive ? "Usuario desactivado" : "Usuario activado",
            isActive: !user.isActive 
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
