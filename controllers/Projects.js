import Project from "../models/ProjectModel.js";
import User from "../models/UserModel.js";

export const getProjects = async (req, res) => {
    try {
        // Obtiene todos los proyectos, independientemente del rol del usuario
        const response = await Project.findAll({
            include: [{
                model: User,
                attributes: ['uuid', 'name', 'username'] // Limitar atributos si es necesario
            }]
        });

        // Devuelve los proyectos encontrados
        res.status(200).json(response);
    } catch (error) {
        // Manejo de errores detallado
        console.error("Error al obtener proyectos:", error.message); // Log para el servidor

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ msg: "Error de base de datos. Por favor, intenta más tarde." });
        }

        // Para cualquier otro tipo de error, devuelve un mensaje genérico
        res.status(500).json({ msg: "Error en el servidor. Por favor, intenta más tarde." });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                uuid: req.params.id
            },
            include: [{
                model: User,
                attributes: ['uuid', 'name', 'username']
            }]
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Error al obtener el proyecto:", error.message);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const createProject = async (req, res) => {
    const { name, description, technologies, fechaInicio, fechaEstimacion, estado, repositoryUrl } = req.body;

    // Validación estricta de campos requeridos
    if (!name || !description || !technologies || !fechaInicio || !fechaEstimacion || !estado) {
        return res.status(400).json({ msg: "Todos los campos son requeridos." });
    }

    // Validación adicional: Si se proporciona repositoryUrl, verificar si es una URL válida
    if (repositoryUrl && !/^https?:\/\/[^\s]+$/.test(repositoryUrl)) {
        return res.status(400).json({ msg: "La URL del repositorio no es válida." });
    }

    try {
        const newProject = await Project.create({
            name,
            description,
            technologies,
            userId: req.userId, // Asegúrate de que req.userId esté definido
            fechaInicio,
            fechaEstimacion,
            repositoryUrl, // Incluir la URL del repositorio si se proporciona
            estado
        });

        res.status(201).json({
            msg: "Proyecto creado exitosamente.",
            project: newProject // Devolver el proyecto creado
        });
    } catch (error) {
        console.error("Error al crear el proyecto:", error.message); // Log del error
        res.status(500).json({ msg: "Error en el servidor. Por favor, intenta más tarde." });
    }
};


export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // Verificar permisos (solo el creador o admin puede actualizar)
        if (project.userId !== req.userId && req.role !== "admin") {
            return res.status(403).json({ msg: "No autorizado para actualizar este proyecto" });
        }

        const {
            name,
            description,
            technologies,
            fechaInicio,
            fechaEstimacion,
            estado,
            repositoryUrl
        } = req.body;

        // Validación de URL si se proporciona
        if (repositoryUrl && !/^https?:\/\/[^\s]+$/.test(repositoryUrl)) {
            return res.status(400).json({ msg: "La URL del repositorio no es válida" });
        }

        await project.update({
            name: name || project.name,
            description: description || project.description,
            technologies: technologies || project.technologies,
            fechaInicio: fechaInicio || project.fechaInicio,
            fechaEstimacion: fechaEstimacion || project.fechaEstimacion,
            estado: estado || project.estado,
            repositoryUrl: repositoryUrl || project.repositoryUrl
        });

        res.status(200).json({
            msg: "Proyecto actualizado exitosamente",
            project
        });
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error.message);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // Verificar permisos (solo el creador o admin puede eliminar)
        if (project.userId !== req.userId && req.role !== "admin") {
            return res.status(403).json({ msg: "No autorizado para eliminar este proyecto" });
        }

        // En lugar de eliminar, podrías agregar un campo 'isDeleted' 
        // await project.update({ isDeleted: true });
        
        // O eliminar completamente
        await project.destroy();

        res.status(200).json({ msg: "Proyecto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error.message);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const searchProjects = async (req, res) => {
    try {
        const { search, estado, technology } = req.query;
        
        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        if (estado) whereClause.estado = estado;
        if (technology) {
            whereClause.technologies = {
                [Op.like]: `%${technology}%`
            };
        }

        const projects = await Project.findAll({
            where: whereClause,
            include: [{
                model: User,
                attributes: ['uuid', 'name', 'username']
            }]
        });

        res.status(200).json(projects);
    } catch (error) {
        handleError(res, error, "Error en la búsqueda de proyectos");
    }
};