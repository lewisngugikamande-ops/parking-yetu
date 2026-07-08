console.log("✅ workstation/index.js loaded");

import { renderWorkstation } from './render.js';

// Default export
export default function initWorkstation() {
    console.log("✅ initWorkstation() called");
    const app = document.getElementById("app");
    if (app) {
        renderWorkstation(app);
    }
}

// Named export (for router compatibility)
export { initWorkstation };
