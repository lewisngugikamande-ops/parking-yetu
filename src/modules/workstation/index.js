import { renderWorkstation } from './render.js';
import { initStatsEventSubscriptions } from './stats.js';
import { addEventUnsubscriber } from './cleanup.js';

export default function initWorkstation() {
    var app = document.getElementById("app");
    if (app) {
        renderWorkstation(app);
    }
    const unsubscribers = initStatsEventSubscriptions();
    unsubscribers.forEach(addEventUnsubscriber);
}
