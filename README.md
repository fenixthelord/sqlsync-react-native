# sqlsync-react-native

React Native SDK for [sqlsync/laravel-sqlsync](https://packagist.org/packages/sqlsync/laravel-sqlsync).

Fetch, search, and display synced accounting data in your mobile app with one hook.

---

## Installation

```bash
npm install sqlsync-react-native
npm install @react-native-async-storage/async-storage
```

---

## Setup

Wrap your app with `SqlSyncProvider`:

```tsx
import { SqlSyncProvider } from 'sqlsync-react-native';

export default function App() {
  return (
    <SqlSyncProvider config={{
      baseUrl: 'https://api.yourapp.com',
      preset: 'al_ameen',
      companyId: 1,         // only if multi-tenant
      perPage: 20,
      refreshInterval: 60000, // auto-refresh every 60s (optional)
    }}>
      <Navigation />
    </SqlSyncProvider>
  );
}
```

---

## Usage

### List + Search

```tsx
import { useSqlSync, useSqlSyncConfig } from 'sqlsync-react-native';
import { FlatList, TextInput, Text, View, ActivityIndicator } from 'react-native';

export function ProductsScreen() {
  const config = useSqlSyncConfig();
  const { records, loading, search, loadMore, refresh, refreshing, total } = useSqlSync(config);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Search products..."
        onChangeText={search}
        style={{ padding: 12, borderBottomWidth: 1 }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.source_guid}
          onEndReached={loadMore}
          onRefresh={refresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.barcode} · {item.unit}</Text>
              <Text>Qty: {item.quantity}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
```

### Single Record

```tsx
import { useSqlSyncRecord, useSqlSyncConfig } from 'sqlsync-react-native';

export function ProductDetail({ guid }: { guid: string }) {
  const config = useSqlSyncConfig();
  const { record, loading } = useSqlSyncRecord(guid, config);

  if (loading) return <ActivityIndicator />;
  if (!record) return <Text>Not found</Text>;

  return (
    <View>
      <Text>{record.name}</Text>
      <Text>{record.latin_name}</Text>
      <Text>Price: {record.extra_data?.price_1}</Text>
    </View>
  );
}
```

### Dashboard Stats

```tsx
import { useSqlSyncStats, useSqlSyncConfig } from 'sqlsync-react-native';

export function Dashboard() {
  const config = useSqlSyncConfig();
  const { stats, loading } = useSqlSyncStats(config);

  if (loading || !stats) return <ActivityIndicator />;

  return (
    <View>
      <Text>Total Products: {stats.total_records}</Text>
      <Text>Agents Online: {stats.agents_online}</Text>
      <Text>Last Sync: {stats.last_sync}</Text>
    </View>
  );
}
```

---

## API Reference

### `useSqlSync(config)`

| Return | Type | Description |
|--------|------|-------------|
| `records` | `SqlSyncRecord[]` | Current page records |
| `loading` | `boolean` | Initial load state |
| `refreshing` | `boolean` | Pull-to-refresh state |
| `error` | `string \| null` | Error message |
| `total` | `number` | Total records count |
| `hasMore` | `boolean` | More pages available |
| `search(term)` | `function` | Search by name/barcode/code |
| `loadMore()` | `function` | Load next page |
| `refresh()` | `function` | Pull-to-refresh |
| `clearSearch()` | `function` | Clear search term |

### `SqlSyncConfig`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | required | Laravel backend URL |
| `preset` | `string` | — | Filter by preset (`al_ameen`, `al_bayan`) |
| `companyId` | `number` | — | Required for multi-tenant |
| `perPage` | `number` | `20` | Items per page |
| `refreshInterval` | `number` | `0` | Auto-refresh in ms (0 = off) |
| `cacheTtl` | `number` | `300000` | Cache TTL in ms (5 min) |

---

## Developer

**محمد خلف · +963945235962**
