export default interface PaginatedData<T> {
  first: number;
  last: number;
  limit: number;
  total: number;
  data: T[];
}

export interface PageDataRequest {
  page: number;
  limit: number;
}

export function getTotalPages(data?: PaginatedData<unknown>) {
  if (!data) {
    return 0;
  }
  return Math.ceil(data.total / data.limit);
}
