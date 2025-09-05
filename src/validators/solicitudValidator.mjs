import { body } from 'express-validator';

export const crearSolicitudAdopcionValidator = [
  body('mascotaId').isMongoId(),
  body('mensaje').optional().isLength({ max: 500 })
];

export const cambiarEstadoValidator = [
  body('estado').isIn(['aceptada', 'rechazada'])
];

export const crearSolicitudDarEnAdopcionValidator = [
  body('refugioId').isMongoId(),
  body('datosMascota.nombre').notEmpty().isLength({ min: 2, max: 50 }),
  body('datosMascota.especie').isIn(['perro', 'gato', 'conejo', 'ave', 'otro']),
  body('datosMascota.edad').optional().isInt({ min: 0 }),
  body('datosMascota.descripcion').optional().isLength({ max: 500 }),
  body('datosMascota.imagen').optional().isURL(),
  body('mensaje').optional().isLength({ max: 500 })
];