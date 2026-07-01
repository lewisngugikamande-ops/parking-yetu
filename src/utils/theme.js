// ============================================
// Theme Management - Dark Mode Default
// ============================================

export function initTheme() {
    // Check localStorage or default to dark
    var savedTheme = localStorage.getItem('parking-theme');
    
    // If no saved preference, default to dark
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('parking-theme', 'dark');
    }
    
    applyTheme(savedTheme);
    window.toggleTheme = toggleTheme;
    console.log('🎨 Theme initialized:', savedTheme);
}

export function toggleTheme() {
    var isLight = document.body.classList.contains('light-theme');
    var newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('parking-theme', newTheme);
    console.log('🎨 Theme toggled to:', newTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        updateToggleButton('☀️');
    } else {
        document.body.classList.remove('light-theme');
        updateToggleButton('🌙');
    }
}

function updateToggleButton(icon) {
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = icon;
}

// Make toggle globally available
window.toggleTheme = toggleTheme;
