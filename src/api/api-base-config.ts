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

const APP_MODE = import.meta.env.VITE_MODE || "development";

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
    req.metadata = {
      startTime: new Date().getTime(),
    };
    const startTime = new Date().toLocaleString();
    console.log(
      `⏳ API Request is starting at ${startTime}. (based on local time)`
    );
    if (APP_MODE === "development")
      console.log(
        `⏳ Method : ${req.method?.toUpperCase()} Request: ${
          req.baseURL + "/" + req.url
        }. (based on local time)`
      );
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.metadata) {
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
    if (error.config?.metadata) {
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
    let responseError: any = null;

    for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
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
      }
    }
    const message =
      responseError?.response?.data?.message ||
      responseError?.message ||
      "An unexpected error occurred.";
    throw Array.isArray(message) ? message : [message];
  }

  // HTTP Helper Methods
  static get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 5000
  ): Promise<T> {
    return Api.request<T>(endpoint, params, "get", headers, timeout);
  }

  static post<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 5000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "post", headers, timeout);
  }

  static put<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 5000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "put", headers, timeout);
  }

  static patch<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 5000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "patch", headers, timeout);
  }

  static delete<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 5000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "delete", headers, timeout);
  }
}

export default Api;
export { axiosInstance };
