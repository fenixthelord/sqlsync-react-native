import { useState, useEffect, useCallback, useRef } from 'react';
import { SqlSyncApiService } from '../services/SqlSyncApiService';
import { cacheGet, cacheSet } from '../utils/cache';
import {
  SqlSyncConfig,
  SqlSyncRecord,
  UseSqlSyncReturn,
} from '../types';

const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSqlSync(config: SqlSyncConfig): UseSqlSyncReturn {
  const api = useRef(new SqlSyncApiService(config));

  const [records, setRecords] = useState<SqlSyncRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const searchRef = useRef('');
  const pageRef = useRef(1);

  const fetchRecords = useCallback(async (
    term: string,
    currentPage: number,
    append: boolean = false,
    silent: boolean = false
  ) => {
    if (!silent) {
      append ? null : setLoading(true);
    }
    setError(null);

    const cacheKey = `records_${config.preset ?? 'all'}_${config.companyId ?? 0}_${term}_${currentPage}`;
    const cacheTtl = config.cacheTtl ?? DEFAULT_CACHE_TTL;

    try {
      // Try cache first (only for first page, non-refresh)
      if (!append && !silent) {
        const cached = await cacheGet<SqlSyncRecord[]>(cacheKey);
        if (cached) {
          setRecords(cached);
          setLoading(false);
        }
      }

      const response = await api.current.getRecords({
        search: term || undefined,
        page: currentPage,
        per_page: config.perPage ?? 20,
      });

      const newRecords = append
        ? [...records, ...response.data]
        : response.data;

      setRecords(newRecords);
      setTotal(response.total);
      setHasMore(response.current_page < response.last_page);

      // Cache first page results
      if (!append) {
        await cacheSet(cacheKey, response.data, cacheTtl);
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [config]);

  // Initial load
  useEffect(() => {
    fetchRecords('', 1);
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!config.refreshInterval || config.refreshInterval <= 0) return;

    const timer = setInterval(() => {
      fetchRecords(searchRef.current, 1, false, true);
    }, config.refreshInterval);

    return () => clearInterval(timer);
  }, [config.refreshInterval]);

  const search = useCallback((term: string) => {
    searchRef.current = term;
    pageRef.current = 1;
    setSearchTerm(term);
    setPage(1);
    fetchRecords(term, 1);
  }, [fetchRecords]);

  const clearSearch = useCallback(() => {
    search('');
  }, [search]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setPage(nextPage);
    fetchRecords(searchRef.current, nextPage, true);
  }, [hasMore, loading, fetchRecords]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    pageRef.current = 1;
    setPage(1);
    fetchRecords(searchRef.current, 1);
  }, [fetchRecords]);

  return {
    records,
    loading,
    refreshing,
    error,
    page,
    hasMore,
    total,
    search,
    loadMore,
    refresh,
    clearSearch,
    searchTerm,
  };
}
