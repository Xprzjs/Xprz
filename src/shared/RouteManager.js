const { getExpress } = require("./AppManager");

/**
 * RouteManager class handles route management for Express.js.
 * @class
 */
class RouteManager {
  /**
   * Express Router instance.
   * @type {object}
   * @private
   */
  constructor() {
    /** @private */
    this.router = getExpress().Router();
    /**
     * Middleware functions.
     * @type {Array}
     * @private
     */
    this.middlewares = [];
  }

  /**
   * Attaches the route manager to an Express app.
   * @param {object} app - Express app instance.
   * @returns {void}
   * @example
   * const app = getApp();
   * const router = new RouteManager();
   * router.attach(app);
   */
  attachTo(app) {
    app.use(this.router);
  }
  /**
   * Registers middleware for the route manager.
   * @param {function} m - Middleware function.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.use(middlewareFunction);
   */
  use(middleware) {
    // Add middleware to the list
    this.middlewares.push(middleware);
    // Check if middleware is present
    /**
     * @private
     */
    this.hasMiddleware = this.middlewares.length > 0 ? true : false;
    return this;
  }

  /**
   * Sets the base path for the route manager.
   * @param {string} path - Base path for the route manager.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.setPath("/api");
   */
  setRoute(path) {
    // Set the base path for the route manager
    /**
     * @private
     */
    this.p = path;
    return this;
  }

  /**
   * Defines a group of routes under a common path.
   * @param {string} mainPath - Main path for the group of routes.
   * @param {function} callback - Callback function to define grouped routes.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.group("/api", (r) => {
   *   r.get("/users", (req, res) => {
   *     res.send("GET /api/users");
   *   });
   * });
   */
  group(mainRoute, callback) {
    // Create a new RouteManager instance
    const subRouteManager = new RouteManager();
    // Define routes within the callback function
    callback(subRouteManager);
    // Mount the sub-route manager on the main route
    this.router.use(mainRoute, subRouteManager.router);
    return this;
  }

  /**
   * Registers a POST route.
   * @param {...function} handlers - Route handler functions.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.setPath("/api/users").post((req, res) => {
   *   res.send("POST /api/users");
   * });
   */
  get(...handlers) {
    if (this.hasMiddleware) {
      // Register route with middleware
      this.registerRoute("get", handlers);
    }
    // Register route without middleware
    this.router.get(this.p, ...handlers);
    return this;
  }
  /**
   * Registers a POST route.
   * @param {...function} handlers - Route handler functions.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.setPath("/api/users").post((req, res) => {
   *   res.send("POST /api/users");
   * });
   */
  post(...handlers) {
    // Register POST route
    this.router.post(this.p, ...handlers);
    return this;
  }

  /**
   * Registers a DELETE route.
   * @param {...function} handlers - Route handler functions.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.setPath("/api/users").del((req, res) => {
   *   res.send("DELETE /api/users");
   * });
   */
  del(...handlers) {
    // Register DELETE route
    this.router.delete(this.p, ...handlers);
    return this;
  }

  /**
   * Registers a PUT route.
   * @param {...function} handlers - Route handler functions.
   * @returns {RouteManager} The RouteManager instance.
   * @example
   * const router = new RouteManager();
   * router.setPath("/api/users").put((req, res) => {
   *   res.send("PUT /api/users");
   * });
   */
  put(...handlers) {
    // Register PUT route
    this.router.put(this.p, ...handlers);
    return this;
  }

  /**
   * Registers a route with the given method, path, and handlers.
   * @private
   */
  registerRoute(method, handlers) {
    // Combine middleware with route handlers
    const routeHandlers = [...this.middlewares, ...handlers];
    // Register the route with Express router
    this.router[method](this.p, routeHandlers);
  }
}

module.exports = RouteManager;