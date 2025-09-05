import IRepository from './IRepository.mjs';
import Role from '../models/Role.mjs';

class RoleRepository extends IRepository {
  constructor() {
    super(Role);
  }

  async findByName(name) {
    return this.model.findOne({ name });
  }

  async findAllWithPermissions() {
    return this.model.find().populate('permissions');
  }
}

export default new RoleRepository();