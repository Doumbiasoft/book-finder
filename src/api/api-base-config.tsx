import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Extend axios types to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      endTime?: number;
      durationInMS?: number;
    };
  }
}

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://www.googleapis.com/books/v1";

const APP_MODE =
  import.meta.env.VITE_MODE || (import.meta.env.DEV ? "development" : "production");

// API timing logs are only printed in development
const isDev = APP_MODE === "development";

// Without a key, Google Books bills every request to a shared anonymous
// project whose daily quota is almost always exhausted (HTTP 429).
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// GET responses are cached to keep the app well under the daily quota.
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "api-cache:";
const memoryCache = new Map<string, { expiresAt: number; data: unknown }>();
const inFlightRequests = new Map<string, Promise<unknown>>();

// Retry policy for transient failures (5xx or network errors)
const TRANSIENT_MAX_ATTEMPTS = 4;
const TRANSIENT_RETRY_DELAY_MS = 500;

const readCache = <T,>(key: string): T | undefined => {
  let entry = memoryCache.get(key);
  if (!entry) {
    try {
      const stored = sessionStorage.getItem(CACHE_PREFIX + key);
      if (stored) entry = JSON.parse(stored);
    } catch {
      // sessionStorage can be unavailable (private mode, blocked storage)
    }
  }
  if (!entry || entry.expiresAt < Date.now()) return undefined;
  memoryCache.set(key, entry);
  return entry.data as T;
};

const writeCache = (key: string, data: unknown) => {
  const entry = { expiresAt: Date.now() + CACHE_TTL_MS, data };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Quota exceeded or storage unavailable: the memory cache still works
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors to API instance
axiosInstance.interceptors.request.use(
  (req) => {
    if (GOOGLE_BOOKS_API_KEY) {
      req.params = { ...req.params, key: GOOGLE_BOOKS_API_KEY };
    }
    req.metadata = {
      startTime: new Date().getTime(),
    };
    if (isDev) {
      const startTime = new Date().toLocaleString();
      console.log(
        `⏳ API Request is starting at ${startTime}. (based on local time)`
      );
      console.log(
        `⏳ Method : ${req.method?.toUpperCase()} Request: ${
          req.baseURL + "/" + req.url
        }. (based on local time)`
      );
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    if (isDev && res.config.metadata) {
      res.config.metadata.endTime = new Date().getTime();
      res.config.metadata.durationInMS =
        res.config.metadata.endTime - res.config.metadata.startTime;

      console.log(
        `⏳ API Request took ${res.config.metadata.durationInMS} milliseconds.`
      );
    }
    return res;
  },
  (error) => {
    if (isDev && error.config?.metadata) {
      error.config.metadata.endTime = new Date().getTime();
      error.config.metadata.durationInMS =
        error.config.metadata.endTime - error.config.metadata.startTime;

      console.log(
        `⏳ API Request took ${error.config.metadata.durationInMS} milliseconds.`
      );
    }
    throw error;
  }
);

class Api {
  static async request<T>(
    endpoint: string,
    data: Record<string, any> = {},
    method: AxiosRequestConfig["method"] = "get",
    customHeaders: Record<string, string> = {},
    retries: number = 3,
    timeout: number = 5000
  ): Promise<T> {
    const headers = {
      ...customHeaders,
    };
    const params = method === "get" ? data : {};
    const requestData = method !== "get" ? data : undefined;

    const send = async (): Promise<T> => {
      let responseError: any = null;
      // Google Books often answers 503 for a moment; GETs get a few
      // extra attempts with backoff even when `retries` is 1.
      const maxAttempts = Math.max(
        1,
        retries,
        method === "get" ? TRANSIENT_MAX_ATTEMPTS : 1
      );

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response: AxiosResponse<T> = await axiosInstance({
            url: endpoint,
            method,
            data: requestData,
            params,
            headers,
            timeout,
          });

          return response.data;
        } catch (error: any) {
          responseError = error;
          // Retrying a rate-limited request only burns more quota
          const status = error?.response?.status;
          if (status === 429) break;

          const isTransient = !status || status >= 500;
          const hasRetriesLeft =
            attempt < Math.max(1, retries) - 1 ||
            (isTransient && attempt < maxAttempts - 1);
          if (!hasRetriesLeft) break;
          if (isTransient) {
            await new Promise((resolve) =>
              setTimeout(resolve, TRANSIENT_RETRY_DELAY_MS * 2 ** attempt)
            );
          }
        }
      }
      const message =
        responseError?.response?.status === 429
          ? "RATE_LIMITED"
          : responseError?.response?.data?.error?.message ||
            responseError?.response?.data?.message ||
            responseError?.message ||
            "An unexpected error occurred.";
      throw Array.isArray(message) ? message : [message];
    };

    if (method !== "get") return send();

    // Serve repeated GETs from cache and share identical in-flight requests
    const cacheKey = endpoint + JSON.stringify(params);
    const cached = readCache<T>(cacheKey);
    if (cached !== undefined) return cached;

    const pending = inFlightRequests.get(cacheKey);
    if (pending) return pending as Promise<T>;

    const request = send()
      .then((result) => {
        writeCache(cacheKey, result);
        return result;
      })
      .finally(() => inFlightRequests.delete(cacheKey));
    inFlightRequests.set(cacheKey, request);
    return request;
  }

  // HTTP Helper Methods
  static get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    headers: Record<string, string> = {},
    retries: number = 1,
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, params, "get", headers, retries, timeout);
  }

  static post<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    retries: number = 1,
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "post", headers, retries, timeout);
  }

  static put<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    retries: number = 1,
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "put", headers, retries, timeout);
  }

  static patch<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    retries: number = 1,
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "patch", headers, retries, timeout);
  }

  static delete<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    retries: number = 1,
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "delete", headers, retries, timeout);
  }
}

export default Api;
export { axiosInstance };

export const isRateLimited = (error: unknown): boolean =>
  Array.isArray(error) && error[0] === "RATE_LIMITED";
