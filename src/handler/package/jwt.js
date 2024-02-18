/**
 * jwtHandler class for handling JSON Web Tokens (JWT) in an Express application.
 */
class jwtHandler {
  /**
   * Creates an instance of jwtHandler.
   * @param {Object} jwt - The JSON Web Token package.
   */
  constructor(jwt) {
    /** @private */
    this.jwt = jwt;
  }

  /**
   * Get the JSON Web Token package.
   * @returns {Object} The JSON Web Token package.
   */
  getJwt() {
    return this.jwt;
  }

  /**
   * Sign a JWT token with the provided payload and secret key.
   * @param {Object} payload - The payload to be signed into the JWT.
   * @param {string} secretKey - The secret key used for signing the JWT.
   * @param {Object} [options={}] - Additional options for signing the JWT.
   * @returns {string} The signed JWT token.
   * @example
   * const token = jwtHandler.jwtSign({ userId: '123' }, 'secret');
   */
  jwtSign(payload, secretKey, options = {}) {
    if (!payload || !secretKey) {
      throw new Error("Payload and secret key are required for JWT signing.");
    }

    return this.jwt.sign(payload, secretKey, options);
  }

  /**
   * Verify a JWT token with the provided secret key.
   * @param {string} token - The JWT token to be verified.
   * @param {string} secretKey - The secret key used for verifying the JWT.
   * @returns {Object} The decoded payload if the token is valid.
   * @throws {Error} If the token or secret key is missing, or if the token verification fails.
   * @example
   * const decoded = jwtHandler.jwtVerify(token, 'secret');
   */
  jwtVerify(token, secretKey) {
    if (!token || !secretKey) {
      throw new Error(
        "Token and secret key are required for JWT verification."
      );
    }

    try {
      return this.jwt.verify(token, secretKey);
    } catch (error) {
      throw new Error("Failed to verify JWT token.");
    }
  }

  /**
   * Check if a JWT token is expired.
   * @param {string} token - The JWT token to be checked.
   * @returns {boolean} True if the token is expired, false otherwise.
   * @example
   * const isExpired = jwtHandler.isTokenExpired(token);
   */
  isTokenExpired(token) {
    try {
      const decoded = this.jwt.decode(token);
      if (!decoded || !decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return false;
    }
  }
  /**
   * Middleware for JWT authentication.
   * @param {string} secretKey - The secret key used for verifying JWT tokens.
   * @returns {function} Middleware function for JWT authentication.
   * @example
   * // Apply JWT authentication middleware
   * app.use(jwtHandlerInstance.jwtAuthenticate('your_secret_key'));
   */
  jwtAuthenticate(secretKey) {
    return (req, res, nxt) => {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No token provided" });
      }
      try {
        const decodedPayload = this.jwtVerify(token, secretKey);
        req.user = decodedPayload;
        nxt();
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
    };
  }
}

module.exports = jwtHandler;
