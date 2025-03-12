import type {
  ApiResponse,
  ApiQueryParams,
  StructuredApiRequest,
  ApiRequest,
} from "./types.js";
import { RequestError, formatStructuredApiRequest } from "./utils.js";

export class FetchBuddy<Routes extends string> {
  private _baseUrl: string;
  private _headers: Headers;

  constructor({ domain, version }: { domain: string; version?: string }) {
    this._baseUrl = `${domain}${version ? `/${version}` : ""}`;
    this._headers = new Headers();
  }

  get headers(): Headers {
    return this._headers;
  }

  private async getResponseError(res: Response, error: unknown) {
    const errorText = await res.text();
    return new RequestError({
      code: res.status,
      data: { message: errorText },
      message: error instanceof Error ? error.message : String(error),
    });
  }

  private getRequestError(error: unknown) {
    return new RequestError({
      code: 500,
      data: {},
      message: error instanceof Error ? error.message : String(error),
    });
  }

  private async handleResponseOk(res: Response) {
    try {
      // Check if response is explicitly empty (No Content)
      if (res.status === 204 || res.status === 205) {
        return null;
      }

      // Check if Content-Length header is 0 (not guaranteed in all responses)
      const contentLength = res.headers.get("Content-Length");
      if (contentLength === "0") {
        return null;
      }

      // Check Content-Type before parsing
      const contentType = res.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        return await res.json();
      }

      if (contentType.includes("text/")) {
        return await res.text();
      }

      return res; // Return raw response for unknown types
    } catch (error) {
      throw await this.getResponseError(res.clone(), error);
    }
  }

  private async request<R>(url: string, init?: RequestInit): Promise<R> {
    try {
      const reqUrl = this._baseUrl.concat(url);
      const reqHeaders = Object.fromEntries(this.headers);
      const res = await fetch(reqUrl, {
        ...init,
        headers: {
          ...reqHeaders,
          ...(init?.headers ?? {}),
        },
      });
      if (res.ok) {
        return (await this.handleResponseOk(res)) as R;
      }
      throw await this.getResponseError(res, res.statusText);
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw this.getRequestError(error);
    }
  }

  get<R extends ApiResponse, Q extends ApiQueryParams = ApiQueryParams>(
    args: string | StructuredApiRequest<Routes, Q>,
    init?: RequestInit
  ): Promise<R> {
    const url =
      typeof args === "string"
        ? args
        : formatStructuredApiRequest<Routes, Q>(args);
    return this.request<R>(url, {
      ...init,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  }

  post<
    R extends ApiResponse,
    B extends ApiRequest,
    Q extends ApiQueryParams = ApiQueryParams
  >(
    args: string | StructuredApiRequest<Routes, Q>,
    body: B,
    init?: RequestInit
  ): Promise<R> {
    const url =
      typeof args === "string"
        ? args
        : formatStructuredApiRequest<Routes, Q>(args);

    return this.request<R>(url, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  }
}
