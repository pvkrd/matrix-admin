import { Constants } from './constants';

/**
 * Retry an asynchronous operation with a specified number of retries and delay.
 *
 * @param {Function} promiseFunction - The async function to retry.
 * @param {number} maxRetries - The maximum number of retry attempts.
 * @param {number} delay - The delay in milliseconds between retries.
 * @param {number[]} skipHTTPStatusCodes - HTTP status codes to skip retries for.
 * @returns {Promise<any>} Resolves when successful, rejects when max retries are reached.
 * @throws {Error} Throws an error if max retries are exhausted, or if a non-skippable HTTP error occurs.
 */
export async function retryPromise(
  promiseFunction,
  maxRetries = Constants.TPA_MAX_RETRIES,
  delay = Constants.TPA_RETRY_DELAY_MS,
  skipHTTPStatusCodes = Constants.TPA_EXCLUDED_HTTP_STATUS_CODES,
) {
  let retries = 0;
  let lastResponseStatus = 0;
  let lastError: Error = null;

  while (retries < maxRetries) {
    try {
      // Attempt the asynchronous operation.
      return await promiseFunction();
    } catch (error) {
      // Capture the last error encountered.
      lastError = error;

      if (error?.response) {
        lastResponseStatus = error.response.status;

        // Check if the HTTP status code should be skipped
        // and propagate the error if not skippable.
        if (skipHTTPStatusCodes.includes(lastResponseStatus)) {
          throw error;
        }
      }

      console.error(`Retry attempt ${retries + 1} failed: ${error.message}`);

      // Delay before the next retry.
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries++;
    }
  }

  console.log(`Last response status: ${lastResponseStatus}`);
  console.log(`Max retries (${maxRetries}) reached.`);

  // If max retries are exhausted, throw the
  // last error encountered during retries.
  throw lastError;
}
