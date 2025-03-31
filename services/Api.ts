import axios, { AxiosRequestConfig } from "axios";

export class ApiService {
  public instance = axios.create({
    headers: {},
  });

  public get = async (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<unknown> => {
    return this.instance
      .get(url, config)
      .then((x) => x.data)
      .catch((err) => {
        if (err?.message === "Network Error") throw new Error("Network Error");
        if (axios.isAxiosError(err)) throw err.response?.data;

        throw err;
      });
  };

  public post = async (
    url: string,
    params?: unknown,
    config?: AxiosRequestConfig
  ): Promise<unknown> => {
    return this.instance
      .post(url, params, config)
      .then((x) => x.data)
      .catch((err) => {
        if (err?.message === "Network Error") throw new Error("Network Error");
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      });
  };

  public put = async (
    url: string,
    params?: unknown,
    config?: AxiosRequestConfig
  ): Promise<unknown> => {
    return this.instance
      .put(url, params, config)
      .then((x) => x.data)
      .catch((err) => {
        if (err?.message === "Network Error") throw new Error("Network Error");
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      });
  };

  public delete = async (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<unknown> => {
    return this.instance
      .delete(url, config)
      .then((x) => x.data)
      .catch((err) => {
        if (err?.message === "Network Error") throw new Error("Network Error");
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      });
  };

  public patch = async (
    url: string,
    params?: unknown,
    config?: AxiosRequestConfig
  ): Promise<unknown> => {
    return this.instance
      .patch(url, params, config)
      .then((x) => x.data)
      .catch((err) => {
        if (err?.message === "Network Error") throw new Error("Network Error");
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      });
  };
}

export const defaultUrl = "https://dynamiccalendarapi.onrender.com/";
export const api = new ApiService();
