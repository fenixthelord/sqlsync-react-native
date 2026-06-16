import { useState, useEffect, useCallback } from 'react';
import { SqlSyncApiService } from '../services/SqlSyncApiService';
import { SqlSyncConfig, SqlSyncStats, UseSqlSyncStatsReturn } from '../types';

export function useSqlSyncStats(config: SqlSyncConfig): UseSqlSyncStatsReturn {
  const [stats, setStats] = useState<SqlSyncStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = new SqlSyncApiService(config);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [config.baseUrl, config.companyId]);

  useEffect(() => { fetch(); }, []);

  return { stats, loading, error, refresh: fetch };
}
