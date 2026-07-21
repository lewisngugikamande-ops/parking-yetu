class MembershipRepository {
  async save(membership) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByIdentityAndOrganization(identityId, organizationId) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
module.exports = MembershipRepository;
