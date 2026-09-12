export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginatedMeta;
}

export function isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as PaginatedResult<unknown>;

  return Array.isArray(candidate.items) && typeof candidate.meta === 'object' && candidate.meta !== null;
}
