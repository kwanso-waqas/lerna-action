/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A StoreResult is a "Maybe" datatype that can be checked at runtime without resorting to exceptions.
 * There is simply a boolean `ok` field that indicates whether the data was succesfully retrieved (or the action
 * succesfully executed).
 */
export type StoreResult<D, E = any> =
  | {
      ok: true;
      data: D;
    }
  | {
      ok: false;
      error: E;
      /**
       * Optional additional context for debugging.
       **/
      detail?: string;

      /**
       * HTTP status equivalent, so 404 if not found, etc.
       */
      status: number;
    };
