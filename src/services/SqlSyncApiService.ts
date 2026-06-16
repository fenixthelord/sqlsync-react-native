import { SqlSyncConfig, SqlSyncRecord, SqlSyncStats, PaginatedResponse } from '../types';

export class SqlSyncApiService {
  private config: SqlSyncConfig;

  constructor(config: SqlSyncConfig) {
    this.config = config;
  }

  private buildUrl(path: string, params: Record<string, any> = {}): string {
    const base = `${this.config.baseUrl.replace(/\/$/, '')}/sqlsync/api/v1/${path}`;
    const query = new URLSearchParams();

    if (this.config.companyId) {
      query.append('company_id', String(this.config.companyId));
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });

    const qs = query.toString();
    return qs ? `${base}?${qs}` : base;
  }

  async getRecords(params: {
    search?: string;
    preset?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<SqlSyncRecord>> {
    const url = this.buildUrl('records', {
      search: params.search,
      preset: params.preset ?? this.config.preset,
      page: params.page ?? 1,
      per_page: params.per_page ?? this.config.perPage ?? 20,
    });

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`SqlSync API error: ${response.status}`);
    }

    return response.json();
  }

  async getRecord(guid: string): Promise<SqlSyncRecord> {
    const url = this.buildUrl(`records/${guid}`);

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`SqlSync API error: ${response.status}`);
    }

    return response.json();
  }

  async getStats(): Promise<SqlSyncStats> {
    const url = this.buildUrl('stats');

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`SqlSync API error: ${response.status}`);
    }

    return response.json();
  }
}
