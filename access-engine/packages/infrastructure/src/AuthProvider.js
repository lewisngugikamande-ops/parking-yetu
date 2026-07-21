const { MockAuthAdapter, JWTAdapter } = require('./adapters/auth');

/**
 * Auth Provider - Configuration-based dependency injection
 * 
 * Selects which authentication adapter to use based on environment variable.
 */
class AuthProvider {
  static getProvider(type = process.env.AUTH_PROVIDER || 'mock') {
    switch (type.toLowerCase()) {
      case 'jwt':
        return new JWTAdapter({
          secret: process.env.JWT_SECRET || 'default-secret-change-me',
        });
      case 'mock':
      default:
        return new MockAuthAdapter();
    }
  }
}

module.exports = AuthProvider;
