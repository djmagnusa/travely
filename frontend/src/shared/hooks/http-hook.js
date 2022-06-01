import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCntrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCntrll);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCntrl.signal
        });

        const responseDate = await response.json();

        if (!response.ok) {
          throw new Error(responseDate.message);
        }

        return responseData;
      } catch (err) {
        setError(err.mesage);
      }
      setIsLoading(false);
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
        activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, [])

  return { isLoading, error, sendRequest, clearError };
};
