import { useState, useEffect } from 'react';
import { SqlSyncApiService } from '../services/SqlSyncApiService';
import { SqlSyncConfig, SqlSyncRecord, UseSqlSyncRecordReturn } from '../types';

export function useSqlSyncRecord(
  guid: string,
  config: SqlSyncConfig
): UseSqlSyncRecordReturn {
  const [record, setRecord] = useState<SqlSyncRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guid) return;

    const api = new SqlSyncApiService(config);

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getRecord(guid);
        setRecord(data);
      } catch (err: any) {
        setError(err.message ?? 'Record not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [guid, config.baseUrl]);

  return { record, loading, error };
}
