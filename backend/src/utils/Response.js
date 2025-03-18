/**
 * Creates a standard response object for returning to clients.
 *
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - A message to send to the client
 * @param {any} data - Additional data to send to the client
 * @returns {object} A response object with a standard structure
 */

export default function createResponse(success, message, data) {
  return {
    status: success ? "success" : "error",
    message: message,
    data: data,
  };
}
