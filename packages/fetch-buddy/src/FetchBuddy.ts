import type {
  ApiResponse,
  ApiQueryParams,
  StructuredApiRequest,
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

  private async handleResponseOk<R>(res: Response) {
    try {
      return (await res.json()) as R;
    } catch (error) {
      throw await this.getResponseError(res, error);
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
        return await this.handleResponseOk<R>(res);
      }
      throw await this.getResponseError(res, res.statusText);
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw this.getRequestError(error);
    }
  }

  get<R extends ApiResponse>(url: string, init?: RequestInit): Promise<R>;
  get<R extends ApiResponse, Q extends ApiQueryParams>(
    args: StructuredApiRequest<Routes, Q>,
    init?: RequestInit
  ): Promise<R>;
  get<R extends ApiResponse, Q extends ApiQueryParams>(
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
}
