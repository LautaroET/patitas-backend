import express from 'express';
import {
  listarMascotas,
  obtenerMascota,
  crearMascota,
  actualizarMascota,
  eliminarMascota
} from '../controllers/mascotaController.mjs';
import { authenticate, authorize } from '../middleware/auth.mjs';
import { isOwnerOfMascota } from '../middleware/ownership.mjs';
import { crearMascotaValidator, actualizarMascotaValidator } from '../validators/mascotaValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', listarMascotas);
router.get('/:id', obtenerMascota);

router.post('/', authenticate, authorize('refugio'), crearMascotaValidator, validate, crearMascota);
router.put('/:id', authenticate, authorize('refugio'), isOwnerOfMascota, actualizarMascotaValidator, validate, actualizarMascota);
router.delete('/:id', authenticate, authorize('refugio'), isOwnerOfMascota, eliminarMascota);

export default router;