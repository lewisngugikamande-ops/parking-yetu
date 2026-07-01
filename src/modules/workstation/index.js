console.log("✅ workstation/index.js loaded");
import { renderWorkstation } from './render.js';

export default function initWorkstation() {
    console.log("✅ initWorkstation() called");
    var app = document.getElementById("app");
    if (app) {
        renderWorkstation(app);
    }
}
