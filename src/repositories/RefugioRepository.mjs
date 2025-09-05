import IRepository from './IRepository.mjs';
import Refugio from '../models/Refugio.mjs';

class RefugioRepository extends IRepository {
  constructor() {
    super(Refugio);
  }

 async findByUsuario(usuarioId) {
  const refugio = await this.model.findOne({ usuario: usuarioId });
  return refugio;
}
}

export default new RefugioRepository();
