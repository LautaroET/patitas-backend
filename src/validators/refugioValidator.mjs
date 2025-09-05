import { body } from 'express-validator';

export const crearRefugioValidator = [
  body('nombre').notEmpty().isLength({ min: 3, max: 100 }),
  body('direccion').notEmpty().isLength({ min: 5, max: 200 }),
  body('telefono').notEmpty().matches(/^[0-9\s\-\+]{7,15}$/),
  body('email').isEmail(),
  body('descripcion').optional().isLength({ max: 500 })
];