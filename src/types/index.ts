// ── Core Record ────────────────────────────────────────────────────────────

export interface SqlSyncRecord {
  id: number;
  company_id: number | null;
  preset: string;
  source_guid: string;
  agent_id: string;
  name: string;
  latin_name: string | null;
  code: string | null;
  barcode: string | null;
  group_name: string | null;
  unit: string | null;
  quantity: number;
  is_active: boolean;
  extra_data: Record<string, any> | null;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

// Al-Ameen specific extra_data
export interface AlAmeenExtraData {
  number: string | null;
  origin: string | null;
  price_1: number | null;
  price_2: number | null;
  price_3: number | null;
  price_4: number | null;
  price_5: number | null;
  price_6: number | null;
  multiple: number | null;
}

// ── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ── Stats ───────────────────────────────────────────────────────────────────

export interface SqlSyncStats {
  total_records: number;
  presets: Record<string, number>;
  last_sync: string | null;
  agents_online: number;
}

// ── Config ──────────────────────────────────────────────────────────────────

export interface SqlSyncConfig {
  /** Base URL of your Laravel backend e.g. https://api.myapp.com */
  baseUrl: string;
  /** company_id — required when multi-tenant is enabled */
  companyId?: number;
  /** Default preset filter */
  preset?: string;
  /** Items per page (default: 20) */
  perPage?: number;
  /** Auto-refresh interval in ms — 0 to disable (default: 0) */
  refreshInterval?: number;
  /** Cache TTL in ms (default: 5 minutes) */
  cacheTtl?: number;
}

// ── Hook return types ───────────────────────────────────────────────────────

export interface UseSqlSyncReturn {
  records: SqlSyncRecord[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  total: number;
  search: (term: string) => void;
  loadMore: () => void;
  refresh: () => void;
  clearSearch: () => void;
  searchTerm: string;
}

export interface UseSqlSyncStatsReturn {
  stats: SqlSyncStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface UseSqlSyncRecordReturn {
  record: SqlSyncRecord | null;
  loading: boolean;
  error: string | null;
}
