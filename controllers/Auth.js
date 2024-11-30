import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const Login = async (req, res) => {
    try {
        // Validar entrada
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "Faltan datos de inicio de sesión" });
        }

        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Contraseña Incorrecta" });

        req.session.userId = user.uuid;
        const { uuid, name, role } = user; // Eliminé username para no repetirlo
        res.status(200).json({ uuid, name, username, role });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor", error: error.message });
    }
};

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Session no iniciada." });
    }
    try {
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'username', 'role'],
            where: {
                uuid: req.session.userId
            }
        });
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor", error: error.message });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Error al cerrar sesión" });
        res.status(200).json({ msg: "Sesión cerrada correctamente" });
    });
};

