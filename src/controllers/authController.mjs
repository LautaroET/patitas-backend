import authService from '../services/authService.mjs';

export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
    };

    export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// ✅ Nuevo: obtener usuario autenticado
export const me = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id); // req.user viene del middleware authenticate
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
