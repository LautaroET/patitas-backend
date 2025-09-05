import express from 'express';
import {
  crearRefugio,
  eliminarRefugio,
  listarRefugios,
  miRefugio,
  obtenerRefugioPorId
} from '../controllers/refugioController.mjs';
import { authenticate, authorize } from '../middleware/auth.mjs';
import { isOwnerOfRefugio } from '../middleware/ownership.mjs';
import { crearRefugioValidator } from '../validators/refugioValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', listarRefugios);
router.get('/:id', obtenerRefugioPorId);

router.post('/', authenticate, authorize('comun'), crearRefugioValidator, validate, crearRefugio);
router.delete('/', authenticate, authorize('refugio'), isOwnerOfRefugio, eliminarRefugio);
router.get('/yo/mi', authenticate, authorize('refugio'), isOwnerOfRefugio, miRefugio);

export default router;