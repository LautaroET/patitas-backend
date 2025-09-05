import IRepository from './IRepository.mjs';
import Permission from '../models/Permission.mjs';

class PermissionRepository extends IRepository {
  constructor() {
    super(Permission);
  }

  async findByName(name) {
    return this.model.findOne({ name });
  }

  async findManyByNames(names) {
    return this.model.find({ name: { $in: names } });
  }
}

export default new PermissionRepository();