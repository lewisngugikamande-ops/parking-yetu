// ============================================
// Error Service - Translate Errors for Humans
// ============================================

const ERROR_MAP = {
    'auth/user-not-found': {
        message: 'No account found with this email address.',
        action: 'Please check your email or create a new account.'
    },
    'auth/wrong-password': {
        message: 'Incorrect password.',
        action: 'Please try again or reset your password.'
    },
    'auth/email-already-in-use': {
        message: 'This email is already registered.',
        action: 'Please login instead or use a different email.'
    },
    'auth/weak-password': {
        message: 'Password is too weak.',
        action: 'Please use at least 6 characters.'
    },
    'auth/invalid-email': {
        message: 'Invalid email address.',
        action: 'Please enter a valid email address.'
    },
    'auth/too-many-requests': {
        message: 'Too many attempts.',
        action: 'Please wait a moment and try again.'
    },
    'auth/network-request-failed': {
        message: 'Network connection lost.',
        action: 'Please check your internet connection.'
    },
    'permission-denied': {
        message: 'You do not have permission to perform this action.',
        action: 'Contact your administrator if you need access.'
    },
    'unavailable': {
        message: 'Service temporarily unavailable.',
        action: 'Please try again in a moment.'
    },
    'deadline-exceeded': {
        message: 'Request timed out.',
        action: 'Please try again or check your connection.'
    }
};

export function translateError(error) {
    if (!error) {
        return {
            message: 'An unknown error occurred.',
            action: 'Please try again or contact support.'
        };
    }

    const code = error.code || error.message || 'unknown';
    
    if (ERROR_MAP[code]) {
        return { ...ERROR_MAP[code], code };
    }

    for (const key in ERROR_MAP) {
        if (code.includes(key)) {
            return { ...ERROR_MAP[key], code };
        }
    }

    return {
        message: error.message || 'An unknown error occurred.',
        action: 'Please try again or contact support.',
        code: code
    };
}

export function formatError(error) {
    const translated = translateError(error);
    return `${translated.message} ${translated.action}`;
}

export function showError(error, target = null) {
    const translated = translateError(error);
    const message = `${translated.message} ${translated.action}`;
    
    if (target) {
        target.textContent = message;
        target.style.display = 'block';
    } else {
        console.error('Error:', message);
        alert(message);
    }
}

export function isNetworkError(error) {
    const code = error?.code || error?.message || '';
    return code.includes('network') || code.includes('unavailable') || code.includes('offline');
}

export function isPermissionError(error) {
    const code = error?.code || error?.message || '';
    return code.includes('permission') || code.includes('unauthorized');
}
