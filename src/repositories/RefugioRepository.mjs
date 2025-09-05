import IRepository from './IRepository.mjs';
import Refugio from '../models/Refugio.mjs';

class RefugioRepository extends IRepository {
  constructor() {
    super(Refugio);
  }

  async findByUsuario(usuarioId) {
    return this.model.findOne({ usuario: usuarioId });
  }
}

export default new RefugioRepository();