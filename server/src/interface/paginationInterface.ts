// types/pagination.ts
import { Request } from 'express';
import { PopulateOptions } from 'mongoose';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationRequest<T = any> extends Request {
  paginatedResults?: PaginationResult<T>;
}

export interface PopulationOptions {
  path: string;
  select?: string;
  populate?: PopulationOptions | PopulationOptions[];
  match?: any;
  options?: any;
}