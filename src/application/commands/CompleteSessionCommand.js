export class CompleteSessionCommand {
    constructor({ sessionId, completedAt }) {
        this.sessionId = sessionId;
        this.completedAt = completedAt;
    }
}
