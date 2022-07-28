import type {
  AxiosInstance,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
} from "axios";
import axios from "axios";
import { HTTP_METHOD } from "~/consts/api";

const handleRequest = (config: AxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;
    const TOKEN = localStorage.getItem(tokenKey);

    if (TOKEN !== null) {
      return {
        ...config,
        Authorization: `Bearer ${TOKEN}`,
      };
    } else {
      return config;
    }
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_DEFAULT_END_POINT}/api/v1`,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleResponse = <T>(response: AxiosResponse<T>) => {
  return response.data;
};

const createApiMethod =
  (_axiosInstance: AxiosInstance, method: Method) =>
  (config: AxiosRequestConfig): Promise<any> => {
    return _axiosInstance({
      ...handleRequest(config),
      headers: {
        ..._axiosInstance.defaults.headers.options,
      },
      method,
    })
      .then((res) => handleResponse(res))
      .catch((err) => {
        throw new Error(err);
      });
  };

export default {
  get: createApiMethod(axiosInstance, HTTP_METHOD.GET),
  post: createApiMethod(axiosInstance, HTTP_METHOD.POST),
  patch: createApiMethod(axiosInstance, HTTP_METHOD.PATCH),
  put: createApiMethod(axiosInstance, HTTP_METHOD.PUT),
  delete: createApiMethod(axiosInstance, HTTP_METHOD.DELETE),
};
