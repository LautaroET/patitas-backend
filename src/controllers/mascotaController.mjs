import mascotaService from '../services/mascotaService.mjs';

export const listarMascotas = async (req, res, next) => {
  try {
    const refugioId = req.query.refugio;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const mascotas = await mascotaService.listarMascotas(refugioId, page, limit);
    res.json(mascotas);
  } catch (err) {
    next(err);
  }
};
export const obtenerMascota = async (req, res, next) => {
  try {
    const mascota = await mascotaService.obtenerMascota(req.params.id);
    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

export const crearMascota = async (req, res, next) => {
  try {
    const mascota = await mascotaService.crearMascota(req.body, req.user.id);
    res.status(201).json(mascota);
  } catch (err) {
    next(err);
  }
};

export const actualizarMascota = async (req, res, next) => {
  try {
    const mascota = await mascotaService.actualizarMascota(req.params.id, req.body, req.user.id);
    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

export const eliminarMascota = async (req, res, next) => {
  try {
    await mascotaService.eliminarMascota(req.params.id, req.user.id);
    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    next(err);
  }
};