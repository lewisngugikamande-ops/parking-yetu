// ==========================================
// SESSION RIPPLES
// ==========================================

export function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 1500);
}

export function createEntryRipple() {
    createRipple(window.innerWidth / 2, window.innerHeight / 2);
}

export function createExitRipple() {
    createRipple(
        window.innerWidth / 2 + 100,
        window.innerHeight / 2 - 50
    );
}
