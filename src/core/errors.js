// ============================================
// Error Handling Utilities
// ============================================

export function translateError(error) {
    // Simple error translation
    if (!error) {
        return { message: 'Unknown error occurred', action: 'Please try again' };
    }
    
    if (typeof error === 'string') {
        return { message: error, action: 'Please try again' };
    }
    
    if (error.message) {
        // Common error messages
        if (error.message.includes('Invalid credentials')) {
            return { message: 'Invalid credentials', action: 'Please check your username and password' };
        }
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            return { message: 'Network error', action: 'Please check your connection to the server' };
        }
        if (error.message.includes('401')) {
            return { message: 'Authentication failed', action: 'Please login again' };
        }
        if (error.message.includes('403')) {
            return { message: 'Permission denied', action: 'You do not have access to this resource' };
        }
        if (error.message.includes('404')) {
            return { message: 'Resource not found', action: 'The requested resource was not found' };
        }
        return { message: error.message, action: 'Please try again' };
    }
    
    return { message: String(error), action: 'Please try again' };
}

export function formatError(error) {
    const translated = translateError(error);
    return `${translated.message} - ${translated.action}`;
}

export default {
    translateError,
    formatError
};
