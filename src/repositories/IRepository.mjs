export default class IRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filter = {}, options = {}) {
    return this.model.find(filter).setOptions(options);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}