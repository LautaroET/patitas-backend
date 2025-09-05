import mongoose from 'mongoose';
import SolicitudService from '../services/solicitudService.mjs';
import RefugioRepository from '../repositories/RefugioRepository.mjs';
import MascotaRepository from '../repositories/MascotaRepository.mjs';
import SolicitudDarEnAdopcionRepository from '../repositories/SolicitudDarEnAdopcionRepository.mjs';

/* ---------- ADOPCIÓN ---------- */
export const crearSolicitudAdopcion = async (req, res, next) => { ... };
export const listarSolicitudesAdopcionRefugio = async (req, res, next) => { ... };
export const listarSolicitudesAdopcionUsuario = async (req, res, next) => { ... };
export const cambiarEstadoSolicitudAdopcion = async (req, res, next) => { ... };

/* ---------- DAR EN ADOPCIÓN ---------- */
export const crearSolicitudDarEnAdopcion = async (req, res, next) => { ... };
export const listarSolicitudesDarEnAdopcionRefugio = async (req, res, next) => { ... };
export const listarSolicitudesDarEnAdopcionUsuario = async (req, res, next) => { ... };

export const cambiarEstadoSolicitudDarEnAdopcion = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });

    const solicitud = await SolicitudDarEnAdopcionRepository.findById(req.params.id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    if (solicitud.refugio.toString() !== refugio._id.toString()) {
      return res.status(403).json({ message: 'Esta solicitud no es de tu refugio' });
    }

    if (!['aceptada', 'rechazada'].includes(req.body.estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const updated = await SolicitudDarEnAdopcionRepository.update(solicitud._id, { estado: req.body.estado });

    if (req.body.estado === 'aceptada') {
      await MascotaRepository.create({
        ...solicitud.datosMascota,
        refugio: refugio._id,
        estado: 'disponible',
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
