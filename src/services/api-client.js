// ==========================================
// API CLIENT - Simple HTTP client
// ==========================================

console.log('📡 API Client initializing...');

class ApiClient {
    constructor() {
        this.baseURL = '/api';
        this.headers = {
            'Content-Type': 'application/json',
        };
        console.log('✅ API Client ready');
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: { ...this.headers, ...options.headers },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.warn(`📡 API request failed: ${endpoint}`, error.message);
            return { success: false, error: error.message };
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Create and export singleton
const apiClient = new ApiClient();
export default apiClient;
