import { body } from 'express-validator';

export const crearSolicitudAdopcionValidator = [
  body('mascota').isMongoId(),
  body('refugio').isMongoId(),
  body('datosSolicitante.nombreCompleto').notEmpty().isLength({ min: 2, max: 100 }),
  body('datosSolicitante.telefono').notEmpty().isLength({ min: 7, max: 20 }),
  body('datosSolicitante.email').isEmail(),
  body('datosSolicitante.mensaje').optional().isLength({ max: 1000 }),
  body('motivosAdopcion').optional().isLength({ max: 1000 })
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
