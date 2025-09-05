import Role from '../models/Role.mjs';
import Permission from '../models/Permission.mjs';

export const listarRoles = async (_req, res, next) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

export const listarPermisos = async (_req, res, next) => {
  try {
    const permisos = await Permission.find();
    res.json(permisos);
  } catch (err) {
    next(err);
  }
};