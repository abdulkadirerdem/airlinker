import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, withCredentials: true });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig], method = 'GET') => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance({
    url,
    method,
    ...config,
  });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  products: {
    getAllProducts: '/products',
    addProduct: '/add-product',
  },

  workspaces: {
    getAllWorkspaces: '/workspaces',
    addWorkspace: '/workspaces',
  },

  airlinks: {
    getAllAirlinks: '/airlinks',
    getAirlinksByWorkstations: '/workspace/airlinks',
    addAirlink: '/airlinks',
  },
};
