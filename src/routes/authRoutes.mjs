import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/authController.mjs';
import { registerValidator, loginValidator } from '../validators/authValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos, intenta más tarde' }
});

router.post('/register', registerValidator, validate, register);
router.post('/login', loginLimiter, loginValidator, validate, login);

export default router;