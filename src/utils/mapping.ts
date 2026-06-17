import { SqlSyncMapping, SqlSyncRecord, ResolvedField } from '../types';

/**
 * Resolves extra_data fields using the mappings from the API.
 * Returns only visible fields, sorted by sort_order.
 *
 * @example
 * const fields = resolveFields(record, mappings);
 * // [{ label: 'سعر المفرق', value: 33750, role: 'retail_price', is_price: true, is_unit: false }]
 */
export function resolveFields(
  record: SqlSyncRecord,
  mappings: SqlSyncMapping[]
): ResolvedField[] {
  if (!record.extra_data || mappings.length === 0) return [];

  return mappings
    .filter((m) => m.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .reduce<ResolvedField[]>((acc, mapping) => {
      const value = record.extra_data?.[mapping.source_field];
      if (value === null || value === undefined) return acc;

      acc.push({
        label:    mapping.target_label,
        value,
        role:     mapping.target_role ?? null,
        is_price: mapping.is_price,
        is_unit:  mapping.is_unit,
      });

      return acc;
    }, []);
}

/**
 * Returns only price fields from resolved fields.
 */
export function getPrices(fields: ResolvedField[]): ResolvedField[] {
  return fields.filter((f) => f.is_price);
}

/**
 * Returns only unit fields from resolved fields.
 */
export function getUnits(fields: ResolvedField[]): ResolvedField[] {
  return fields.filter((f) => f.is_unit);
}

/**
 * Returns the value of a specific role (e.g. 'retail_price').
 */
export function getFieldByRole(
  fields: ResolvedField[],
  role: string
): ResolvedField | undefined {
  return fields.find((f) => f.role === role);
}
