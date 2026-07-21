class MembershipResolver {
  constructor(membershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  async resolve(identityId, organizationId) {
    const membership = await this.membershipRepository.findByIdentityAndOrganization(identityId, organizationId);
    if (!membership) throw new Error("No membership found");
    if (!membership.isActive()) throw new Error("Membership is not active");
    return membership;
  }
}

module.exports = MembershipResolver;
