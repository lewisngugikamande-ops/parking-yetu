class SessionRepository {
  async save(session) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findActiveByResource(resourceId) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
module.exports = SessionRepository;
