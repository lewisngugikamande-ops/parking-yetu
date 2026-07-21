export class CreateSessionCommand {
    constructor({ organizationId, accessPointId, personId, credentialId, token, startedAt }) {
        this.organizationId = organizationId;
        this.accessPointId = accessPointId;
        this.personId = personId;
        this.credentialId = credentialId;
        this.token = token;
        this.startedAt = startedAt;
    }
}
