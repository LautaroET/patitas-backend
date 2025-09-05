import express from 'express';
import authRoutes from './authRoutes.mjs';
import refugioRoutes from './refugioRoutes.mjs';
import mascotaRoutes from './mascotaRoutes.mjs';
import roleRoutes from './roleRoutes.mjs';
import solicitudRoutes from './solicitudRoutes.mjs';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/refugios', refugioRoutes);
router.use('/mascotas', mascotaRoutes);
router.use('/', roleRoutes);
router.use('/solicitudes', solicitudRoutes);

export default router;