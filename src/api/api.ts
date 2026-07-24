import { routes } from "@/routing/routes";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const BAD_JWT = "bad_jwt";

const REFRESH_ENDPOINTS = ["/v1/auth/refresh", "/v1/admin/auth/refresh"];

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface ApiCallParams<A> {
  data?: A;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  config?: AxiosRequestConfig;
}

export function apiCall<R, A = unknown>({
  url,
  method = "GET",
  data,
  config,
}: ApiCallParams<A>): Promise<AxiosResponse<R>> {
  return api.request<R>({
    url,
    method,
    ...(method === "GET" ? { params: data } : { data }),
    ...config,
  });
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response.data.code ?? "";
    if (code === BAD_JWT) {
    }
    return Promise.reject(error);
  }
);
