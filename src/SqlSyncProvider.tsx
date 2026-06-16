import React, { createContext, useContext, ReactNode } from 'react';
import { SqlSyncConfig } from '../types';

const SqlSyncContext = createContext<SqlSyncConfig | null>(null);

interface SqlSyncProviderProps {
  config: SqlSyncConfig;
  children: ReactNode;
}

/**
 * Wrap your app (or screen) with SqlSyncProvider to avoid
 * passing config to every hook manually.
 *
 * @example
 * <SqlSyncProvider config={{ baseUrl: 'https://api.myapp.com', preset: 'al_ameen' }}>
 *   <App />
 * </SqlSyncProvider>
 */
export function SqlSyncProvider({ config, children }: SqlSyncProviderProps) {
  return (
    <SqlSyncContext.Provider value={config}>
      {children}
    </SqlSyncContext.Provider>
  );
}

/**
 * Returns the SqlSync config from the nearest SqlSyncProvider.
 * Throws if used outside a provider.
 */
export function useSqlSyncConfig(): SqlSyncConfig {
  const config = useContext(SqlSyncContext);
  if (!config) {
    throw new Error('useSqlSyncConfig must be used within a <SqlSyncProvider>');
  }
  return config;
}
