const jwtHandler = require("../handler/package/jwt"),
  bcryptjsHandler = require("../handler/package/bcryptjs"),
  BodyParser = require("../handler/package/bodyParser"),
  Cors = require("../handler/package/cors"),
  Csrf = require("../handler/package/csrf"),
  { PackageInitializationError } = require("../Errors/package.manager.error"),
  $install = require("../utils/installPkg");
const Dotenv = require("../handler/package/dotenv");

const { useApp, getApp } = require("../shareApp");
let connectMongo = false;
function initSession() {
  if (connectMongo) {
    return $install("express-session");
  }
  return null;
}
/**
 * PackageManager class for managing various packages and middleware in an Express application.
 */
class PackageManager {
  constructor() {}
  /**
   * Initialize and configure Express session middleware.
   * @param {...any} options - Options for configuring the session middleware.
   * @throws {Error} Throws an error if Express app has not been initialized.
   * @example
   * const pkgManager = new Package();
   * pkgManager.session({ secret: 'secret', resave: false, saveUninitialized: true });
   */
  session(...options) {
    const session = initSession();
    if (session) {
      useApp(session(...options));
    } else {
      // Handle the case when session initialization is skipped.
      // You might want to throw an error or log a warning.
      console.warn("Session initialization skipped. connectMongo is false.");
    }
  }

  /**
   * Initialize and configure JWT handler.
   * @returns {jwtHandler} Instance of jwtHandler.
   * @example
   * const pkgManager = new Package();
   * const jwt = pkgManager.jwt();
   */
  jwt() {
    const pkg = $install("jsonwebtoken");
    return new jwtHandler(pkg);
  }

  /**
   * Initialize and configure bcryptjs handler.
   * @returns {bcryptjsHandler} Instance of bcryptjsHandler.
   * @example
   * const pkgManager = new Package();
   * const bcryptjs = pkgManager.bcryptjs();
   */
  bcryptjs() {
    const pkg = $install("bcryptjs");
    return new bcryptjsHandler(pkg);
  }

  /**
   * Initialize and configure body parser middleware.
   * @param {...Function} handler - Optional additional handlers to use with body-parser.
   * @returns {BodyParser} Instance of BodyParser.
   * @example
   * const pkgManager = new Package();
   * const bodyParser = pkgManager.bodyParser();
   */
  bodyParser(...handler) {
    const pkg = $install("body-parser");
    const use = useApp.bind(this);
    return new BodyParser(pkg, use, ...handler);
  }

  /**
   * Initialize and configure CSRF protection middleware.
   * @param {Object|null} options - Optional additional options to configure CSRF protection.
   * @returns {Csrf} Instance of Csrf.
   * @example
   * const pkgManager = new Package();
   * const csrf = pkgManager.csrf();
   * const csrfWithHandler = pkgManager.csrf({ cookie: true });
   */
  csrf(options = null, isSetup = true) {
    const pkg = $install("csurf");
    const use = useApp.bind(this);
    const app = getApp.bind(this);
    return new Csrf(pkg, use, app, options, isSetup);
  }

  /**
   * Initialize and configure CORS middleware.
   * @param {...Function} handler - Optional additional handlers to use with CORS.
   * @returns {Cors} Instance of Cors.
   * @example
   * const pkgManager = new Package();
   * const cors = pkgManager.cors(handler);
   */
  cors(...handler) {
    const pkg = $install("cors");
    const use = useApp.bind(this);
    return new Cors(pkg, use, ...handler);
  }
  /**
   * Initialize and configure connect-mongodb-session middleware.
   * @param {...any} options - Options for configuring the MongoDB session store.
   * @returns {Object} Instance of MongoDB session store.
   * @example
   * const pkgManager = new Package();
   * const store = pkgManager.connectMongoDbSession();
   */
  connectMongoDbSession(...options) {
    connectMongo = true;
    const session = initSession();
    try {
      const connectMongoDbSession = $install("connect-mongodb-session")(
        session
      );
      return new connectMongoDbSession(...options);
    } catch (error) {
      throw new PackageInitializationError(
        "connect-mongodb-session",
        error.message
      );
    }
  }
  /**
   * Methods for interacting with dotenv.
   * @typedef {Object} DotenvMethods
   * @property {Function} getDot - A function to retrieve environment variables.
   * @property {Function} setupDot - A function to configure dotenv settings.
   */

  /**
   * Initialize and configure dotenv for managing environment variables.
   * @returns {DotenvMethods} An object containing methods for interacting with dotenv.
   * @example
   * const pkgManager = new Package();
   * const dotenv = pkgManager.dotenv();
   * dotenv.setupDot(true);
   */
  dotenv() {
    const { getDot, setupDot } = new Dotenv();
    return { getDot, setupDot };
  }
}
module.exports = PackageManager;
