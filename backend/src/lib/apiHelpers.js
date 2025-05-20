import { ZodError } from "zod";

/**
 * Given a ZodError, returns an array of objects with a field and
 * the first error message for that field. If the error is not a
 * ZodError, returns the error unchanged.
 *
 * @param {Error} error
 * @returns {Array<{field: string, message: string}> | Error}
 */

export function parseZodError(error) {
  if (!(error instanceof ZodError)) return error;

  const errors = error.flatten().fieldErrors;

  const formattedErrors = Object.entries(errors).map(([field, messages]) => ({
    field,
    message: messages[0],
  }));

  return formattedErrors;
}
