export type ApiResponse = Record<string, unknown> | Record<string, unknown>[];
export type ApiRequest = Record<string, unknown> | Record<string, unknown>[];
export type ApiQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;
export type ApiRequestError<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  detail: string;
  error_code: number;
  data: D;
};

export type StructuredApiRequest<
  Routes extends string = string,
  QP extends ApiQueryParams = ApiQueryParams
> = {
  root: Routes;
  segments?: (string | number | undefined | null)[];
  queryParams?: QP;
};
