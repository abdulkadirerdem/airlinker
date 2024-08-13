import { AxiosRequestConfig } from 'axios';
import { useState, useCallback } from 'react';

import { fetcher } from 'src/utils/axios';

const useSubmitter = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitData = useCallback(
    async (args: string | [string, AxiosRequestConfig], method = 'POST') => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetcher(args, method);
        setSuccess(true);
        setData(response);
        Promise.resolve(response);
      } catch (err) {
        setError(err);
        setSuccess(false);
        Promise.reject(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, error, isLoading, success, submitData };
};

export default useSubmitter;
