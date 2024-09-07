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

  forms: {
    addForm: '/forms',
    submitForm: (id: string | number) => `/forms/${id}/responses`,
  },

  quizzes: {
    addQuiz: '/quizzes',
    getQuizzes: '/quizzes',
    getQuizById: (id: string | number) => `/quizzes/${id}`,
    updateQuiz: (id: string | number) => `/quizzes/${id}`,
    deleteQuiz: (id: string | number) => `/quizzes/${id}`,
    submitQuizResponse: (quizId: string | number) => `/quizzes/${quizId}/submit`,
    submitQuiz: (id: string | number) => `/quizzes/${id}/submit`,
  },

  raffles: {
    addRaffle: '/raffles',
    getRaffles: '/raffles',
    getRaffleById: (id: string | number) => `/raffles/${id}`,
    updateRaffle: (id: string | number) => `/raffles/${id}`,
    deleteRaffle: (id: string | number) => `/raffles/${id}`,
    submitRaffle: (id: string | number) => `/raffles/${id}/participants`,
    drawWinner: (raffleId: string | number) => `/raffles/${raffleId}/draw`,
  },
};
