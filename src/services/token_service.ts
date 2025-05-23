/**
 * TokenService - Handles token storage with expiration
 *
 * This service provides methods to store, retrieve, and validate tokens
 * with an expiration time of 3600 seconds (1 hour).
 */

// Token storage keys
const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Token expiration time in seconds (1 hour)
const TOKEN_EXPIRATION_TIME = 3600;

export class TokenService {
  /**
   * Store a token with expiration time
   * @param token The token to store
   */
  static setToken(token: string): void {
    if (!token) return;

    // Store the token
    localStorage.setItem(TOKEN_KEY, token);

    // Calculate and store expiration time
    const expiryTime = Date.now() + TOKEN_EXPIRATION_TIME * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Get the stored token if it's valid (not expired)
   * @returns The token if valid, null otherwise
   */
  static getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

    // If no token or expiry time, return null
    if (!token || !expiryTime) {
      return null;
    }

    // Check if token is expired
    const expiryTimeMs = parseInt(expiryTime, 10);
    if (Date.now() > expiryTimeMs) {
      // Token is expired, clear it
      this.clearToken();
      return null;
    }

    // Token is valid
    return token;
  }

  /**
   * Clear the stored token and expiry time
   */
  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if the token is valid (exists and not expired)
   * @returns true if token is valid, false otherwise
   */
  static isTokenValid(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Refresh the token expiration time
   * @returns true if token was refreshed, false if no valid token exists
   */
  static refreshTokenExpiry(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // Update expiration time
    const expiryTime = Date.now() + TOKEN_EXPIRATION_TIME * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    return true;
  }
}
