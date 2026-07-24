import { routes } from "@/routing/routes";
import type { Error as ApiError } from "@/types";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const BAD_JWT = "bad_jwt";

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

interface ApiCallParams<A> {
  data?: A;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  config?: AxiosRequestConfig;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiClientOptions {
  refreshEndpoint: string;
  loginRoute: string;
}

const createApiClient = ({
  refreshEndpoint,
  loginRoute,
}: ApiClientOptions) => {
  const client = axios.create(API_CONFIG);
  let refreshRequest: Promise<void> | null = null;

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as RetryRequestConfig | undefined;
      const code = error.response?.data?.error.code;

      if (
        code !== BAD_JWT ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url === refreshEndpoint
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshRequest) {
          refreshRequest = client
            .post<void>(refreshEndpoint)
            .then(() => undefined)
            .finally(() => {
              refreshRequest = null;
            });
        }

        await refreshRequest;
        return client.request(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname !== loginRoute) {
          window.location.assign(loginRoute);
        }
        return Promise.reject(refreshError);
      }
    }
  );

  return client;
};

const createApiCall =
  (client: AxiosInstance) =>
  <R, A = unknown>({
    url,
    method = "GET",
    data,
    config,
  }: ApiCallParams<A>): Promise<AxiosResponse<R>> =>
    client.request<R>({
      url,
      method,
      ...(method === "GET" ? { params: data } : { data }),
      ...config,
    });

export const userHttpClient = createApiClient({
  refreshEndpoint: "/users/auth/refresh-token",
  loginRoute: routes.login,
});

export const adminHttpClient = createApiClient({
  refreshEndpoint: "/admin/auth/refresh-token",
  loginRoute: routes.admin_login,
});

export const userApiCall = createApiCall(userHttpClient);
export const adminApiCall = createApiCall(adminHttpClient);
