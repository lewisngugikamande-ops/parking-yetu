class CredentialResolver {
  constructor(credentialRepository) {
    this.credentialRepository = credentialRepository;
  }

  async resolve(credentialData) {
    const credential = await this.credentialRepository.findByValue(credentialData);
    if (!credential) throw new Error("Credential not found");
    if (!credential.isValid()) throw new Error("Credential is invalid or expired");
    return credential;
  }
}

module.exports = CredentialResolver;
