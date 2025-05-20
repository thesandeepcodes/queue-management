export default class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @param {number} statusCode - Http status code
   * @param {object} errorInfo - Additional error information
   * @param {string|Error} [errorStack=null] - Optional error stack or original error
   */

  constructor(statusCode, errorInfo = {}, errorStack = null) {
    super(errorInfo?.message || "Unexpected error occurred.");
    this.statusCode = statusCode;
    this.errorInfo = errorInfo;

    if (errorStack instanceof Error) {
      this.stack = errorStack.stack;
    } else if (typeof errorStack === "string") {
      this.stack = errorStack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
