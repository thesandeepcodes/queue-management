export default class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @param {number} statusCode - Http status code
   * @param {object} errorInfo - Additional error information
   * @prop {string} message - Error message
   * @prop {number} statusCode - Http status code
   * @prop {object} errorInfo - Additional error information
   */

  constructor(statusCode, errorInfo = {}) {
    super(errorInfo?.message || "Unexpected error occurred.");
    this.statusCode = statusCode;
    this.errorInfo = errorInfo;
  }
}
