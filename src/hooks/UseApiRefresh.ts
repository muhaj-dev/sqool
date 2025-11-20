import { useCallback, useEffect, useState } from "react";

interface Pagination {
  total: number;
  currentPage: string;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

interface ApiResponse<T> {
  data: {
    result: T[];
    pagination: Pagination;
  };
  message: string;
}

interface UseApiRefreshOptions<T> {
  initialData?: T[];
  getData: () => Promise<ApiResponse<T>>;
  mutateData?: (data: any) => Promise<any>;
}

export function useApiRefresh<T>(options: UseApiRefreshOptions<T>) {
  const { initialData = [], getData, mutateData } = options;
  const [data, setData] = useState<T[]>(initialData);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData();
      setData(response.data.result);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [getData]);

  useEffect(() => {
    void fetchData();
  }, [fetchData, refresh]);

  const handleMutation = useCallback(
    async (mutationData: any) => {
      if (!mutateData) return;
      setLoading(true);
      try {
        const response = await mutateData(mutationData);
        setRefresh((prev) => prev + 1);
        return response;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred during mutation"));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutateData],
  );

  const manualRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    refresh: manualRefresh,
    mutate: handleMutation,
    fetchData, // Expose fetchData for manual triggering if needed
  };
}
