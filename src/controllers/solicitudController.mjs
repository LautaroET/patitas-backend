import SolicitudService from '../services/solicitudService.mjs';
import RefugioRepository from '../repositories/RefugioRepository.mjs';
import MascotaRepository from '../repositories/MascotaRepository.mjs';

export const crearSolicitudAdopcion = async (req, res, next) => {
  try {
    const { mascota: mascotaId, datosSolicitante, motivosAdopcion } = req.body;

    // 1. Encontrar la mascota para obtener el ID del refugio
    const mascota = await MascotaRepository.findById(mascotaId);
    if (!mascota) {
        return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    // 2. Preparar el payload completo para el servicio
    const payload = {
        usuarioId: req.user.id,
        mascotaId: mascota._id, // Usamos el ID de la mascota encontrada
        refugioId: mascota.refugio, // ✅ Obtenemos el ID del refugio de la mascota
        datosSolicitante, // ✅ Pasamos los datos del solicitante
        motivosAdopcion, // ✅ Pasamos los motivos de adopción
    };

    // 3. Llamar al servicio con el payload completo
    const solicitud = await SolicitudService.crearSolicitudAdopcion(payload);
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

export const cambiarEstadoSolicitudDarEnAdopcion = async (req, res, next) => {
  try {
    const refugio = await RefugioRepository.findByUsuario(req.user.id);
    if (!refugio) return res.status(403).json({ message: 'No tienes un refugio' });

    const solicitud = await SolicitudDarEnAdopcionRepository.findById(req.params.id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    // corroborar que la solicitud pertenece a SU refugio
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
    next(err); // ← esto es el 500 que ves
  }
};

export const crearSolicitudDarEnAdopcion = async (req, res, next) => {
  try {
    const { refugioId, datosMascota, mensajeDelUsuario } = req.body; // ✅ Extraemos los campos del body
    const solicitud = await SolicitudService.crearSolicitudDarEnAdopcion({
      usuarioId: req.user.id,
      refugioId, // ✅ Pasamos refugioId
      datosMascota, // ✅ Pasamos datosMascota
      mensaje: mensajeDelUsuario // ✅ Ahora el nombre de la variable coincide con el del servicio
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
