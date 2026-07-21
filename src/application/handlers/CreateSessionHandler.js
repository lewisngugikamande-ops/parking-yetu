import { Session } from '../../core/access/Session.js';

export class CreateSessionHandler {
    constructor({ sessionRepository, eventBus }) {
        this.sessionRepository = sessionRepository;
        this.eventBus = eventBus;
    }

    async handle(command) {
        const session = Session.create({
            id: command.sessionId || this._generateId(),
            organizationId: command.organizationId,
            accessPointId: command.accessPointId,
            personId: command.personId,
            credentialId: command.credentialId,
            token: command.token,
            startedAt: command.startedAt || new Date()
        });

        await this.sessionRepository.save(session);

        const events = session.pullEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }

        return session;
    }

    _generateId() {
        return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }
}
