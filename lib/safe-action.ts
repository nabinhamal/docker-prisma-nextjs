import { handleError, ServerActionResult } from "./error-handler";

/**
 * A wrapper for Server Actions to provide consistent error handling and response structure.
 * 
 * @param action The server action function to wrap.
 * @returns A wrapped action that returns a ServerActionResult.
 */
export function safeAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<ServerActionResult<TResult>> => {
    try {
      const data = await action(...args);
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  };
}
