import { body } from 'express-validator';

export const crearMascotaValidator = [
  body('nombre').notEmpty().isLength({ min: 2, max: 50 }),
  body('especie').isIn(['perro', 'gato', 'conejo', 'ave', 'otro']),
  body('edad').optional().isInt({ min: 0 }),
  body('estado').optional().isIn(['disponible', 'en proceso de adopción', 'adoptado']),
  body('descripcion').optional().isLength({ max: 500 }),
  body('imagen').optional().isURL()
];

export const actualizarMascotaValidator = [
  body('nombre').optional().isLength({ min: 2, max: 50 }),
  body('especie').optional().isIn(['perro', 'gato', 'conejo', 'ave', 'otro']),
  body('edad').optional().isInt({ min: 0 }),
  body('estado').optional().isIn(['disponible', 'en proceso de adopción', 'adoptado']),
  body('descripcion').optional().isLength({ max: 500 }),
  body('imagen').optional().isURL()
];