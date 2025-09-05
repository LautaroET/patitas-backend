import IRepository from './IRepository.mjs';
import Refugio from '../models/Refugio.mjs';

class RefugioRepository extends IRepository {
  constructor() {
    super(Refugio);
  }

 async findByUsuario(usuarioId) {
  const refugio = await this.model.findOne({ usuario: usuarioId });
  console.log("🔍 Buscando refugio para usuario:", usuarioId);
  console.log("🔍 Refugio encontrado:", refugio?._id);
  return refugio;
}
}

export default new RefugioRepository();
