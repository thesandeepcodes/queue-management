import { useState, useEffect, useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFetch(endpoint, options = {}, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState({
    show: false,
    object: null,
    message: "",
  });

  if (!BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const fetchData = useCallback(async () => {
    setLoading(true);

    let encounteredError = true;

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        credentials: "include",
        ...options,
      });

      const result = await res.json();

      if (result.status !== "success") {
        setError({
          show: true,
          object: result?.error || {},
          message: result.message || "Something went wrong. Please try again.",
        });
      }

      if (result.status == "success") {
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
  }, [fetchData, immediate]);

  return { data, loading, setLoading, error, setError, refetch: fetchData };
}
