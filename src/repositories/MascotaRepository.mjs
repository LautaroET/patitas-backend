import IRepository from './IRepository.mjs';
import Mascota from '../models/Mascota.mjs';

class MascotaRepository extends IRepository {
  constructor() {
    super(Mascota);
  }

  async findByRefugio(refugioId) {
    return this.model.find({ refugio: refugioId });
  }
}

export default new MascotaRepository();