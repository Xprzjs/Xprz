const Validation = require("../../validation/validations");
const Request = require("../baseReq");
/**
 * Class extending the baseReq class to enhance request handling capabilities.
 * @extends Request
 */
class ReqEnhancer extends Request {
  constructor(req) {
    super(req);
    /** @private */
    this.validation = new Validation(req.body);
    // Bind methods to ensure they have access to the correct 'this' context
    this.hasQueryParam = this.hasQueryParam.bind(this);
    this.validate = this.validate.bind(this)
    this.verifyBody = this.verifyBody.bind(this);
    this.getQueryParam = this.getQueryParam.bind(this);
    this.hasBodyParam = this.hasBodyParam.bind(this);
    this.hasCookie = this.hasCookie.bind(this);
    this.getCookieName = this.getCookieName.bind(this);
    this.hasHeaderIgnoreCase = this.hasHeaderIgnoreCase.bind(this);
    this.getHeaderIgnoreCase = this.getHeaderIgnoreCase.bind(this);
    this.isMethod = this.isMethod.bind(this);
    this.getAcceptedContentTypes = this.getAcceptedContentTypes.bind(this);
  }

  /**
   * Validates a request object against specified rules.
   * @param {object} req - The request object to be validated.
   * @param {object} rules - The validation rules to be applied.
   * @param {object} [options={}] - Additional options for validation.
   * @returns {object} - The validation result.
   * @example
   * // Define the request object and validation rules
   * const request = { body: { username: 'example', age: 25 } };
   * const rules = { username: 'string|username', age: 'number|min:18' };
   * // Validate the request
   * const errors = validate(ctx.body, rules);
   * // Handle the validation result
   * if (Object.keys(errors).length === 0) {
   *   res.status(200).json({ success: true });
   * } else {
   *   res.status(400).json({ success: false, errors });
   * }
   */
  validate(req, rules, options = {}) {
    // Create a new instance of RequestValidator
    const validator = new Validation(req);
    // Perform validation using the provided rules and options
    return validator.validate(rules, options);
  }


  /**
   * Validates the request body against the provided rules.
   * @param {object} rules - The validation rules to be applied.
   * @param {object} [options={}] - Additional options for validation.
   * @returns {object} - The validation result.
   * @example
   * // Define validation rules
   * const validationRules = {
   *   username: 'string',
   *   password: 'string|min:6',
   * };
   * // Additional options for validation
   * const validationOptions = {
   *   customMessages: {
   *     password: 'Password must be at least 6 characters long.',
   *   },
   * };
   * // Validate request body
   * const errors = ctx.req.verifyBody(validationRules, validationOptions);
   * if (Object.keys(errors).length === 0) {
   *   console.log('Request body is valid.');
   * } else {
   *   console.error('Validation errors:', errors);
   * }
   */
  verifyBody(rules, options = {}) {
    // Perform validation and return the result
    return this.validation.body(rules, options);
  }
  /**
   * Checks if the request has a specific query parameter.
   * @param {string} paramName - The name of the query parameter to check.
   * @returns {boolean} True if the query parameter exists, otherwise false.
   * @example
   * 
   * const hasParam = ctx.req.hasQueryParam('paramName');
   */
  hasQueryParam(paramName) {
    return paramName in this.req.query;
  }

  /**
   * Retrieves a specific query parameter from the request.
   * @param {string} paramName - The name of the query parameter to retrieve.
   * @returns {*} The value of the query parameter, or undefined if not found.
   * @example
   * 
   * const paramValue = ctx.req.getQueryParam('paramName');
   */
  getQueryParam(paramName) {
    return this.req.query[paramName];
  }

  /**
   * Checks if the request has a specific body parameter.
   * @param {string} paramName - The name of the body parameter to check.
   * @returns {boolean} True if the body parameter exists, otherwise false.
   * @example
   * 
   * const hasParam = ctx.req.hasBodyParam('paramName');
   */
  hasBodyParam(paramName) {
    return paramName in this.req.body;
  }

  /**
   * Checks if the request has a specific cookie.
   * @param {string} cookieName - The name of the cookie to check.
   * @returns {boolean} True if the cookie exists, otherwise false.
   * @example
   * 
   * const hasCookie = ctx.req.hasCookie('cookieName');
   */
  hasCookie(cookieName) {
    return cookieName in this.req.cookies;
  }

  /**
   * Retrieves a specific cookie from the request.
   * @param {string} cookieName - The name of the cookie to retrieve.
   * @returns {*} The value of the cookie, or undefined if not found.
   * @example
   * 
   * const cookieValue = ctx.req.getCookieName('cookieName');
   */
  getCookieName(cookieName) {
    return this.req.cookies[cookieName];
  }

  /**
   * Checks if the request has a specific header with a case-insensitive comparison.
   * @param {string} headerName - The name of the header to check.
   * @returns {boolean} True if the header exists, otherwise false.
   * @example
   * 
   * const hasHeader = ctx.req.hasHeaderIgnoreCase('headerName');
   */
  hasHeaderIgnoreCase(headerName) {
    const headers = Object.keys(this.req.headers).map((header) =>
      header.toLowerCase()
    );
    return headers.includes(headerName.toLowerCase());
  }

  /**
   * Retrieves a specific header from the request with a case-insensitive comparison.
   * @param {string} headerName - The name of the header to retrieve.
   * @returns {*} The value of the header, or undefined if not found.
   * @example
   * 
   * const headerValue = ctx.req.getHeaderIgnoreCase('headerName');
   */
  getHeaderIgnoreCase(headerName) {
    const headers = Object.keys(this.req.headers).reduce((acc, curr) => {
      acc[curr.toLowerCase()] = this.req.headers[curr];
      return acc;
    }, {});
    return headers[headerName.toLowerCase()];
  }

  /**
   * Checks if the request is sent with a specific HTTP method.
   * @param {string} method - The HTTP method to check (e.g., 'GET', 'POST').
   * @returns {boolean} True if the request method matches the specified method, otherwise false.
   * @example
   * 
   * const isGetMethod = ctx.req.isMethod('GET');
   */
  isMethod(method) {
    return this.req.method.toLowerCase() === method.toLowerCase();
  }
  /**
   * Retrieves the accepted content types by the request.
   * @returns {string[]} An array of accepted content types.
   * @example
   * 
   * const acceptedTypes = ctx.req.getAcceptedContentTypes();
   */
  getAcceptedContentTypes() {
    return this.req.accepts();
  }
}

module.exports = ReqEnhancer;
