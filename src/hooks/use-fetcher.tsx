import { AxiosRequestConfig } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { fetcher } from 'src/utils/axios';

function useFetcher<T = any>(args: string | [string, AxiosRequestConfig] | null, interval = null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    if (args === null) return null;

    try {
      const response = await fetcher(args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      return err;
    } finally {
      setIsLoading(false);
    }
  }, [args]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    fetchData();

    if (interval) {
      const intervalId = setInterval(fetchData, interval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, interval]);

  return { data, error, isLoading, refetch: fetchData };
}

export default useFetcher;
