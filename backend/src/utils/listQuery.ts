export type SortDirection = 'asc' | 'desc';

export type ListQueryParams<TSortField extends string = string> = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: TSortField;
  sortOrder: SortDirection;
};

export const parseListQuery = <TSortField extends string = string>(
  query: Record<string, unknown>,
): ListQueryParams<TSortField> => {
  const pageValue = Number(query.page ?? 1);
  const limitValue = Number(query.limit ?? 10);

  return {
    page: Number.isNaN(pageValue) ? 1 : pageValue,
    limit: Number.isNaN(limitValue) ? 10 : limitValue,
    search:
      typeof query.search === 'string' && query.search.trim()
        ? query.search
        : undefined,
    sortBy:
      typeof query.sortBy === 'string'
        ? (query.sortBy as TSortField)
        : undefined,
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
};
