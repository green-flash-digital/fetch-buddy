import {
  type ApiQueryParams,
  type StructuredApiRequest,
  type ApiRequestError,
} from "./types.js";

/**
 * Provided a structured request object, this utility will format the structured
 * request object into a string that will be used as the URL for the request
 */
export function formatStructuredApiRequest<
  Routes extends string = string,
  Q extends ApiQueryParams = ApiQueryParams
>(args: StructuredApiRequest<Routes, Q>): string {
  // Parse the QueryParams
  const urlSearchParams = Object.entries(
    args.queryParams ?? {}
  ).reduce<URLSearchParams>((accum, [argKey, argValue]) => {
    if (typeof argValue === "string") {
      accum.set(argKey, argValue);
    }
    if (typeof argValue === "number") {
      accum.set(argKey, argValue.toString());
    }
    if (typeof argValue === "boolean") {
      accum.set(argKey, argValue ? "true" : "false");
    }
    // Ignore null or undefined values
    return accum;
  }, new URLSearchParams());

  // Parse the segments
  const urlSegments = (args.segments ?? []).filter(Boolean).join("/");

  // URL assembly
  const requestQueryParams =
    urlSearchParams.size === 0 ? "" : `?${urlSearchParams.toString()}`;
  const requestRoot = args.root;
  const requestSegments = urlSegments.length === 0 ? "" : `/${urlSegments}`;
  const requestUrl = `${requestRoot}${requestSegments}${requestQueryParams}`;
  return requestUrl;
}

export class RequestError<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Error {
  private _code: number;
  private _data: D;

  constructor({
    message,
    code,
    data,
  }: {
    code: number;
    message: string;
    data: D;
  }) {
    super(message);
    this._code = code;
    this.name = "RequestError";
    this._data = data;

    // Maintains proper stack trace for where the error was thrown (only available on V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }

  payload(): ApiRequestError<D> {
    return {
      detail: this.message,
      error_code: this._code,
      data: this._data,
    };
  }
}
