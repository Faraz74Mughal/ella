// middleware/pagination.ts
import { Response, NextFunction } from 'express';
import { Model, Document, FilterQuery, PopulateOptions } from 'mongoose';
import { PaginationRequest } from '../interface/paginationInterface';

export const paginate = <T extends Document>(
  model: Model<T>,
  select:string,
  populateOptions: PopulateOptions | PopulateOptions[] = []
) => {
  return async (req: PaginationRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const skip = (page - 1) * limit;

      // Build filter
      const filter: FilterQuery<T> = {};
      const excludedParams = ['page', 'limit', 'sort', 'search'];

      Object.keys(req.query).forEach((key) => {
        if (!excludedParams.includes(key) && req.query[key] !== undefined) {
          (filter as any)[key] = req.query[key];
        }
      });

      // Handle sorting
      let sort: Record<string, 1 | -1> = { createdAt: -1 };
      if (req.query.sort) {
        const sortFields = (req.query.sort as string).split(',');
        sort = {};
        sortFields.forEach((field) => {
          if (field.startsWith('-')) {
            sort[field.substring(1)] = -1;
          } else {
            sort[field] = 1;
          }
        });
      }

      // Create base query
      let query = model.find(filter).select(select).sort(sort);

      // Apply population (single or multi-level)
      if (Array.isArray(populateOptions) && populateOptions.length > 0) {
        populateOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else if (populateOptions) {
        query = query.populate(populateOptions);
      }

      // Execute query with pagination
      const [data, total] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        model.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      req.paginatedResults = {
        data,
        pagination: {
          current: page,
          pages: totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };

      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
};
