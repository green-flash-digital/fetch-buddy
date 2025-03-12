import type {
  ApiQueryParams,
  ApiRequestError,
  ApiResponse,
  StructuredApiRequest,
} from "fetch-buddy";
import { FetchBuddy, formatStructuredApiRequest } from "fetch-buddy";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo } from "react";
import useSWR, { SWRConfig } from "swr";
import type { Product, Pagination } from "mockingjson";

import { List } from "../../components/List";

type ApiRoutes = "/products";

const fetchBuddy = new FetchBuddy<ApiRoutes>({
  domain: "/api",
});

function useGetAccessToken() {
  const getAccessToken = useCallback(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Received access token");
          resolve();
        }, 2_000);
      }),
    []
  );
  return getAccessToken;
}

function useApi() {
  const getAccessToken = useGetAccessToken();

  useEffect(() => {
    async function addMiddleware() {
      console.log("Getting access token");
      await getAccessToken();
      console.log("Setting access token");
    }

    addMiddleware();
  }, [getAccessToken]);

  return fetchBuddy;
}

function useGet<
  R extends ApiResponse,
  QP extends ApiQueryParams = ApiQueryParams
>(args: StructuredApiRequest<ApiRoutes, QP> & { shouldLoad?: boolean }) {
  const shouldLoad = args.shouldLoad ?? true;

  return useSWR<R, ApiRequestError>(
    shouldLoad ? formatStructuredApiRequest<ApiRoutes, QP>(args) : null
  );
}

function RequestProvider({ children }: { children: ReactNode }) {
  const api = useApi();

  return (
    <SWRConfig
      value={useMemo(
        () => ({
          fetcher: async (url: string) => {
            console.log("Making request");
            const data = await api.get(url);
            console.log("Making request... complete");
            return data;
          },
          refreshInterval: 300_000, // 5 minutes
          shouldRetryOnError: false,
          revalidateOnFocus: process.env.NODE_ENV === "production",
        }),
        [api]
      )}
    >
      {children}
    </SWRConfig>
  );
}

export function WithSWR() {
  return (
    <RequestProvider>
      <WithSWRContent />
    </RequestProvider>
  );
}

function WithSWRContent() {
  const res = useGet<Pagination<Product>>({
    root: "/products",
    queryParams: {},
  });

  if (res.isLoading) {
    return <div>Loading...</div>;
  }
  if (res.error) {
    return <div>{res.error.detail}</div>;
  }
  if (typeof res.data === "undefined") {
    return <div>No data</div>;
  }
  return (
    <List>
      {res.data.data.map((product) => (
        <li key={product.id}>
          <div>{product.title}</div>
          <p>{product.description}</p>
        </li>
      ))}
    </List>
  );
}
