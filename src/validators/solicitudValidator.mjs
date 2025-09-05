import { body } from 'express-validator';

export const crearSolicitudAdopcionValidator = [
  body('mascota').isMongoId().withMessage('El ID de la mascota es inválido.'),
  body('datosSolicitante.nombreCompleto').notEmpty().isLength({ min: 2, max: 100 }).withMessage('Nombre completo requerido y entre 2-100 caracteres.'),
  body('datosSolicitante.telefono').notEmpty().isLength({ min: 7, max: 20 }).withMessage('Teléfono requerido y entre 7-20 caracteres.'),
  body('datosSolicitante.email').isEmail().withMessage('Email inválido.'),
  body('datosSolicitante.mensaje').optional().isLength({ max: 1000 }).withMessage('Mensaje debe tener menos de 1000 caracteres.'),
  body('motivosAdopcion').optional().isLength({ max: 1000 }).withMessage('Motivos de adopción debe tener menos de 1000 caracteres.')
];

export const cambiarEstadoValidator = [
  body('estado').isIn(['aceptada', 'rechazada']).withMessage('Estado inválido. Debe ser "aceptada" o "rechazada".')
];

export const crearSolicitudDarEnAdopcionValidator = [
  body('refugioId').isMongoId().withMessage('El ID del refugio es inválido.'),
  body('datosMascota.nombre').notEmpty().isLength({ min: 2, max: 50 }).withMessage('Nombre de la mascota requerido y entre 2-50 caracteres.'),
  body('datosMascota.especie').isIn(['perro', 'gato', 'conejo', 'ave', 'otro']).withMessage('Especie de la mascota inválida.'),
  body('datosMascota.edad').optional().isInt({ min: 0 }).withMessage('Edad de la mascota inválida.'),
  body('datosMascota.descripcion').optional().isLength({ max: 500 }).withMessage('Descripción de la mascota debe tener menos de 500 caracteres.'),
  body('datosMascota.fotos').optional().isURL().withMessage('La URL de la foto de la mascota es inválida.'),
  body('mensajeDelUsuario').optional().isLength({ max: 500 }).withMessage('Mensaje debe tener menos de 500 caracteres.')
];