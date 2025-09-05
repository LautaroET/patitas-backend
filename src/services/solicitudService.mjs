import SolicitudAdopcionRepository from '../repositories/SolicitudAdopcionRepository.mjs';
import SolicitudDarEnAdopcionRepository from '../repositories/SolicitudDarEnAdopcionRepository.mjs';
import MascotaRepository from '../repositories/MascotaRepository.mjs';
import RefugioRepository from '../repositories/RefugioRepository.mjs';

class SolicitudService {
  async crearSolicitudAdopcion({ usuarioId, mascotaId, refugioId, datosSolicitante, motivosAdopcion }) {
  const mascota = await MascotaRepository.findById(mascotaId);
  if (!mascota) throw new Error('Mascota no encontrada');

  const yaExiste = await SolicitudAdopcionRepository.existeSolicitud(usuarioId, mascotaId);
  if (yaExiste) throw new Error('Ya has enviado una solicitud para esta mascota');

  return await SolicitudAdopcionRepository.create({
    usuario: usuarioId,
    mascota: mascotaId,
    refugio: refugioId,
    datosSolicitante,
    motivosAdopcion
  });
}

  async listarSolicitudesAdopcionPorRefugio(refugioId) {
    return await SolicitudAdopcionRepository.findByRefugio(refugioId);
  }

  async listarSolicitudesAdopcionPorUsuario(usuarioId) {
    return await SolicitudAdopcionRepository.findByUsuario(usuarioId);
  }

  async cambiarEstadoSolicitudAdopcion(solicitudId, nuevoEstado, refugioId) {
    const solicitud = await SolicitudAdopcionRepository.findById(solicitudId);
console.log("🔍 Comparando:");
console.log("  - solicitud.refugio:", solicitud.refugio.toString());
console.log("  - refugioId:", refugioId);
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (solicitud.refugio.toString() !== refugioId) throw new Error('No autorizado');
    if (!['aceptada', 'rechazada'].includes(nuevoEstado)) throw new Error('Estado inválido');

    const updated = await SolicitudAdopcionRepository.update(solicitudId, { estado: nuevoEstado });

    if (nuevoEstado === 'aceptada') {
      await MascotaRepository.update(solicitud.mascota, { estado: 'en proceso de adopción' });
    }

    return updated;
  }

  async crearSolicitudDarEnAdopcion({ usuarioId, refugioId, datosMascota, mensajeDelUsuario }) {
    const yaExiste = await SolicitudDarEnAdopcionRepository.existeSolicitudPendiente(usuarioId, refugioId);
    if (yaExiste) throw new Error('Ya tienes una solicitud pendiente con este refugio');

    return await SolicitudDarEnAdopcionRepository.create({
      usuario: usuarioId,
      refugio: refugioId,
      datosMascota,
      mensajeDelUsuario 
    });
}

  async listarSolicitudesDarEnAdopcionPorRefugio(refugioId) {
    return await SolicitudDarEnAdopcionRepository.findByRefugio(refugioId);
  }

  async listarSolicitudesDarEnAdopcionPorUsuario(usuarioId) {
    return await SolicitudDarEnAdopcionRepository.findByUsuario(usuarioId);
  }

async cambiarEstadoSolicitudDarEnAdopcion(solicitudId, nuevoEstado, refugioId) {
    const solicitud = await SolicitudDarEnAdopcionRepository.findById(solicitudId);
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (solicitud.refugio.toString() !== refugioId.toString()) throw new Error('No autorizado');
    if (!['aceptada', 'rechazada'].includes(nuevoEstado)) throw new Error('Estado inválido');

    const updated = await SolicitudDarEnAdopcionRepository.update(solicitudId, { estado: nuevoEstado });

    if (nuevoEstado === 'aceptada') {
      await MascotaRepository.create({
        ...solicitud.datosMascota,
        refugio: refugioId,
        estado: 'disponible'
      });
    }

    return updated;
  }
} // <--- ¡Esta llave faltaba y causaba el problema!

export default new SolicitudService();