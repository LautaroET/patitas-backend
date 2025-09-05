import IRepository from './IRepository.mjs';
import User from '../models/User.mjs';

class UserRepository extends IRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }

  async findByUsername(username) {
    return this.model.findOne({ username });
  }
}

async findById(id) {
    return this.model.findById(id).populate('role');
  }
}

export default new UserRepository();
