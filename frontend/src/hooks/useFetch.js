import { request } from "@/lib/client/request";
import { useState, useEffect, useCallback } from "react";

export function useFetch(
  endpoint,
  options = {},
  immediate = true,
  onSuccess = (data) => {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState({
    show: false,
    object: null,
    message: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    let encounteredError = true;

    try {
      const result = await request(endpoint, options);

      if (result.status !== "success") {
        setError({
          show: true,
          object: result?.error || {},
          message: result.message || "Something went wrong. Please try again.",
        });
      }

      if (result.status == "success") {
        onSuccess(result);
        setData(result);
        encounteredError = false;
      }
    } catch (err) {
      setError({
        show: true,
        object: {},
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);

      if (!encounteredError) {
        setError({
          show: false,
          object: null,
          message: "",
        });
      }
    }
  }, [endpoint, options]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, []);

  return {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
    refetch: fetchData,
  };
}
