import express from 'express';
import {
  crearSolicitudAdopcion,
  listarSolicitudesAdopcionRefugio,
  listarSolicitudesAdopcionUsuario,
  cambiarEstadoSolicitudAdopcion,
  crearSolicitudDarEnAdopcion,
  listarSolicitudesDarEnAdopcionRefugio,
  listarSolicitudesDarEnAdopcionUsuario,
  cambiarEstadoSolicitudDarEnAdopcion
} from '../controllers/solicitudController.mjs';
import { authenticate, authorize } from '../middleware/auth.mjs';
import {
  crearSolicitudAdopcionValidator,
  crearSolicitudDarEnAdopcionValidator,
  cambiarEstadoValidator
} from '../validators/solicitudValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/adopcion', authenticate, authorize('comun'), crearSolicitudAdopcionValidator, validate, crearSolicitudAdopcion);
router.get('/adopcion/refugio', authenticate, authorize('refugio'), listarSolicitudesAdopcionRefugio);
router.get('/adopcion/usuario', authenticate, authorize('comun'), listarSolicitudesAdopcionUsuario);
router.patch('/adopcion/:id', authenticate, authorize('refugio'), cambiarEstadoValidator, validate, cambiarEstadoSolicitudAdopcion);

router.post('/dar-en-adopcion', authenticate, authorize('comun'), crearSolicitudDarEnAdopcionValidator, validate, crearSolicitudDarEnAdopcion);
router.get('/dar-en-adopcion/refugio', authenticate, authorize('refugio'), listarSolicitudesDarEnAdopcionRefugio);
router.get('/dar-en-adopcion/usuario', authenticate, authorize('comun'), listarSolicitudesDarEnAdopcionUsuario);
router.patch('/dar-en-adopcion/:id', authenticate, authorize('refugio'), cambiarEstadoValidator, validate, cambiarEstadoSolicitudDarEnAdopcion);

export default router;