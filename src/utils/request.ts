import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// Create an axios instance
const axiosInstance = axios.create({ baseURL: HOST_API, withCredentials: true });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

type RequestMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
}

const request = async <T>(
  method: RequestMethod,
  endpoint: string,
  data: Record<string, any> = {},
  queryParams: Record<string, any> = {}
): Promise<T> => {
  try {
    const sessionToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('COOKIE-KEY='))
      ?.split('=')[1];

    const config: RequestConfig = {
      method,
      url: endpoint,
      data: method !== 'GET' && method !== 'DELETE' ? data : undefined,
      params: queryParams,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    };

    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    console.error(`Error with ${method} request:`, error);
    const status = error?.response?.status;

    if (status === 400) {
      console.error(`Error: ${error.response?.data?.detail}`);
    } else if (status === 404) {
      console.error(error.response?.data?.detail);
    } else {
      console.error('Something went wrong!');
    }

    throw new Error('An error has occurred!');
  }
};

// Export functions for API requests
export const postData = <T>(endpoint: string, payload: Record<string, any>): Promise<T> =>
  request<T>('POST', endpoint, payload);

export const putData = <T>(endpoint: string, payload: Record<string, any>): Promise<T> =>
  request<T>('PUT', endpoint, payload);

export const getData = <T>(endpoint: string, queryParams: Record<string, any> = {}): Promise<T> =>
  request<T>('GET', endpoint, {}, queryParams);

export const deleteData = <T>(endpoint: string, payload: Record<string, any>): Promise<T> =>
  request<T>('DELETE', endpoint, payload);
