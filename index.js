import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TestRoute from "./routes/TestRoute.js";
import helmet from 'helmet'; // Agregamos helmet para seguridad adicional
import DashboardRoute from "./routes/DashboardRoute.js";

dotenv.config();

const app = express();

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Configuración básica de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", process.env.CLIENT_URL],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            fontSrc: ["'self'", "data:"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true, // Cambiado a false por seguridad
    store: store,
    cookie: {
        secure: false, // Mantenemos true para HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 1 día
    }
}));

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL, // Cambiamos esto para usar CLIENT_URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(UserRoute);
app.use(ProjectRoute);
app.use(AuthRoute);
app.use(TestRoute);
app.use(DashboardRoute);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        msg: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log('Error no manejado:', err.message);
    // En producción podrías querer mantener el servidor funcionando
    // pero en desarrollo es bueno saber si hay errores no manejados
    if (process.env.NODE_ENV === 'development') {
        process.exit(1);
    }
});