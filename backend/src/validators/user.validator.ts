import { z } from 'zod';
import {
  ACCOUNT_STATUS,
  AUTH_PROVIDERS,
  USER_ROLES,
} from '../constants/user.constant';

const roleValues = Object.values(USER_ROLES) as [string, ...string[]];
const accountStatusValues = Object.values(ACCOUNT_STATUS) as [string, ...string[]];
const authProviderValues = Object.values(AUTH_PROVIDERS) as [string, ...string[]];

export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().min(1).optional(),
    role: z.enum(roleValues).optional(),
    accountStatus: z.enum(accountStatusValues).optional(),
    authProvider: z.enum(authProviderValues).optional(),
    isEmailVerified: z.enum(['true', 'false']).optional(),
    sortBy: z
      .enum(['createdAt', 'updatedAt', 'name', 'email', 'username', 'lastLoginAt'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
