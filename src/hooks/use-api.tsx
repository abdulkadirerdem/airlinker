import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TEST_BASE_URL,
});

export default api;
