import { FilterQuery, Model, SortOrder } from "mongoose";

export type PaginationMeta = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GenericListResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type QueryOptions<T> = {
  model: Model<T>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  searchFields?: string[];
  filters?: Record<string, unknown>;
  baseFilter?: FilterQuery<T>;
  select?: string;
  allowedSortFields?: string[];
  populate?: string | string[] | any;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const getPaginationValues = (
  page?: number,
  limit?: number,
): { page: number; limit: number; skip: number } => {
  const normalizedPage = !page || page < 1 ? DEFAULT_PAGE : page;
  const normalizedLimit = !limit
    ? DEFAULT_LIMIT
    : Math.min(Math.max(limit, 1), MAX_LIMIT);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildSearchFilter = <T>(
  search: string | undefined,
  searchFields: string[] = [],
): FilterQuery<T> => {
  if (!search || !searchFields.length) return {};

  const safeSearch = escapeRegex(search.trim());
  if (!safeSearch) return {};

  return {
    $or: searchFields.map((field) => ({
      [field]: { $regex: safeSearch, $options: "i" },
    })),
  } as FilterQuery<T>;
};

const buildFilterQuery = <T>(
  filters?: Record<string, unknown>,
): FilterQuery<T> => {
  if (!filters) return {};

  const cleanedEntries = Object.entries(filters).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });

  return Object.fromEntries(cleanedEntries) as FilterQuery<T>;
};

const buildSortQuery = (
  sortBy: string | undefined,
  sortOrder: "asc" | "desc" | undefined,
  allowedSortFields: string[] | undefined,
): Record<string, SortOrder> => {
  const fallbackSort = { createdAt: -1 as SortOrder };

  if (!sortBy) return fallbackSort;
  if (allowedSortFields?.length && !allowedSortFields.includes(sortBy)) {
    return fallbackSort;
  }

  return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
};

export const applyQueryFeatures = async <T>(
  options: QueryOptions<T>,
): Promise<GenericListResult<T>> => {
  const {
    model,
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    searchFields,
    filters,
    baseFilter,
    select,
    allowedSortFields,
  } = options;

  const {
    page: currentPage,
    limit: pageLimit,
    skip,
  } = getPaginationValues(page, limit);

  const queryFilter: FilterQuery<T> = {
    ...(baseFilter || {}),
    ...buildFilterQuery<T>(filters),
    ...buildSearchFilter<T>(search, searchFields),
  };

  const sort = buildSortQuery(sortBy, sortOrder, allowedSortFields);

  let finder = model.find(queryFilter).sort(sort).skip(skip).limit(pageLimit);
  if (select) finder.select(select);

  if (options.populate) {
    finder = finder.populate(options.populate);
  }

  const [items, total] = await Promise.all([
    finder,
    model.countDocuments(queryFilter),
  ]);

  const totalPages = Math.ceil(total / pageLimit);

  return {
    items,
    pagination: {
      total,
      totalPages,
      page: currentPage,
      limit: pageLimit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};
