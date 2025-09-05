import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './src/routes/index.mjs';
//import swaggerDocs from './src/docs/swagger.mjs';
import uploadRoutes from './src/routes/uploadRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    dotenv.config();
    const app = express();

    /* ---------- Config ---------- */
    const PORT = process.env.PORT || 3000;

    const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
    };

    /* ---------- Middleware ---------- */
    app.use(cors(corsOptions));
    app.use(express.json());


    // Servir archivos estáticos
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    /* ---------- Routes ---------- */
        app.use('/api', routes);
        app.use('/api/upload', uploadRoutes);
        //swaggerDocs(app);

    /* ---------- Health checks ---------- */
    app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));
    app.get('/', (_req, res) => res.json({ message: 'API funcionando – Patitas al Rescate' }));

    /* ---------- DB + Server start ---------- */
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB conectado – Patitas al Rescate');
        app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        console.log(`🌍 Accede en: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error conectando MongoDB:', err.message);
        process.exit(1);
    });

    /* ---------- Manejo de errores no capturados ---------- */
    process.on('unhandledRejection', (err) => {
    console.error('Error no manejado:', err);
    process.exit(1);
    });