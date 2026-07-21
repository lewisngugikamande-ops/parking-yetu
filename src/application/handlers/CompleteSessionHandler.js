export class CompleteSessionHandler {
    constructor({ sessionRepository, eventBus }) {
        this.sessionRepository = sessionRepository;
        this.eventBus = eventBus;
    }

    async handle(command) {
        const session = await this.sessionRepository.findById(command.sessionId);
        if (!session) {
            throw new Error(`Session not found: ${command.sessionId}`);
        }

        session.confirmExit(command.completedAt || new Date());

        await this.sessionRepository.save(session);

        const events = session.pullEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }

        return session;
    }
}
