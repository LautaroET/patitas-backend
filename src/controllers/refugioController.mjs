import refugioService from '../services/refugioService.mjs';
import Refugio from '../models/Refugio.mjs';

export const crearRefugio = async (req, res, next) => {
  try {
    const refugio = await refugioService.crearRefugio(req.body, req.user.id);
    res.status(201).json(refugio);
  } catch (err) {
    next(err);
  }
};

export const eliminarRefugio = async (req, res, next) => {
  try {
    const result = await refugioService.eliminarRefugio(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const listarRefugios = async (_req, res, next) => {
  try {
    const refugios = await refugioService.listarRefugios();
    res.json(refugios);
  } catch (err) {
    next(err);
  }
};

export const miRefugio = async (req, res, next) => {
  try {
    const refugio = await refugioService.obtenerRefugioPorUsuario(req.user.id);
    if (!refugio) return res.status(404).json({ message: 'No tienes refugio' });
    res.json(refugio);
  } catch (err) {
    next(err);
  }
};

export const obtenerRefugioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const refugio = await Refugio.findById(id).populate('usuario', 'username email').select('-__v');
    if (!refugio) return res.status(404).json({ message: 'Refugio no encontrado' });
    res.json(refugio);
  } catch (err) {
    next(err);
  }
};