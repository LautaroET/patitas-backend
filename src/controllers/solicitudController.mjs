import SolicitudService from '../services/solicitudService.mjs';
import RefugioRepository from '../repositories/RefugioRepository.mjs';

export const crearSolicitudAdopcion = async (req, res, next) => {
  try {
    const { mascotaId, mensaje } = req.body;
    const solicitud = await SolicitudService.crearSolicitudAdopcion({
      usuarioId: req.user.id,
      mascotaId,
      mensaje
    });
    res.status(201).json(solicitud);
  } catch (err) {
    next(err);
  }
};

export const listarSolicitudesAdopcionRefugio = async (req, res, next) => {
  try {
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });
    const solicitudes = await SolicitudService.listarSolicitudesAdopcionPorRefugio(refugio._id);
    res.json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const listarSolicitudesAdopcionUsuario = async (req, res, next) => {
  try {
    const solicitudes = await SolicitudService.listarSolicitudesAdopcionPorUsuario(req.user.id);
    res.json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const cambiarEstadoSolicitudAdopcion = async (req, res, next) => {
  try {
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });
    const updated = await SolicitudService.cambiarEstadoSolicitudAdopcion(
      req.params.id,
      req.body.estado,
      refugio._id
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const crearSolicitudDarEnAdopcion = async (req, res, next) => {
  try {
    const solicitud = await SolicitudService.crearSolicitudDarEnAdopcion({
      usuarioId: req.user.id,
      ...req.body
    });
    res.status(201).json(solicitud);
  } catch (err) {
    next(err);
  }
};

export const listarSolicitudesDarEnAdopcionRefugio = async (req, res, next) => {
  try {
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });
    const solicitudes = await SolicitudService.listarSolicitudesDarEnAdopcionPorRefugio(refugio._id);
    res.json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const listarSolicitudesDarEnAdopcionUsuario = async (req, res, next) => {
  try {
    const solicitudes = await SolicitudService.listarSolicitudesDarEnAdopcionPorUsuario(req.user.id);
    res.json(solicitudes);
  } catch (err) {
    next(err);
  }
};

export const cambiarEstadoSolicitudDarEnAdopcion = async (req, res, next) => {
  try {
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });
    const updated = await SolicitudService.cambiarEstadoSolicitudDarEnAdopcion(
      req.params.id,
      req.body.estado,
      refugio._id
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};