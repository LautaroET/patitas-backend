import IRepository from './IRepository.mjs';
import SolicitudAdopcion from '../models/SolicitudAdopcion.mjs';

class SolicitudAdopcionRepository extends IRepository {
  constructor() {
    super(SolicitudAdopcion);
  }

  async findByRefugio(refugioId) {
    return this.model
      .find({ refugio: refugioId })
      .populate('usuario', 'username email')
      .populate('mascota', 'nombre especie edad imagen');
  }

  async findByUsuario(usuarioId) {
    return this.model
      .find({ usuario: usuarioId })
      .populate('mascota', 'nombre especie edad imagen')
      .populate('refugio', 'nombre email');
  }

  async existeSolicitud(usuarioId, mascotaId) {
    return this.model.findOne({ usuario: usuarioId, mascota: mascotaId });
  }
  async deleteMany(filter, opts = {}) {
    return this.model.deleteMany(filter, opts);
  }
}

export default new SolicitudAdopcionRepository();