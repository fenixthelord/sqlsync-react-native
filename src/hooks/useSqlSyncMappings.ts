import { useState, useEffect, useCallback } from 'react';
import { SqlSyncApiService } from '../services/SqlSyncApiService';
import { SqlSyncConfig, SqlSyncMapping, UseSqlSyncMappingsReturn } from '../types';

export function useSqlSyncMappings(config: SqlSyncConfig): UseSqlSyncMappingsReturn {
  const [mappings, setMappings] = useState<SqlSyncMapping[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const api = new SqlSyncApiService(config);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMappings(config.preset ?? 'al_ameen');
      setMappings(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  }, [config.baseUrl, config.preset, config.companyId]);

  useEffect(() => { fetch(); }, []);

  return { mappings, loading, error, refresh: fetch };
}
