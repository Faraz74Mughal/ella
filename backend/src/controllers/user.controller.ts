import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { parseListQuery } from '../utils/listQuery';

type UserSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'name'
  | 'email'
  | 'username'
  | 'lastLoginAt';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const parsedQuery = parseListQuery<UserSortBy>(
    req.query as Record<string, unknown>,
  );

  const role = req.query.role as string | undefined;
  const accountStatus = req.query.accountStatus as string | undefined;
  const authProvider = req.query.authProvider as string | undefined;

  const isEmailVerifiedRaw = req.query.isEmailVerified as string | undefined;
  const isEmailVerified =
    isEmailVerifiedRaw === undefined
      ? undefined
      : isEmailVerifiedRaw === 'true';

  const result = await UserService.getAllUsers({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    search: parsedQuery.search,
    role,
    accountStatus,
    authProvider,
    isEmailVerified,
    sortBy: parsedQuery.sortBy ?? 'createdAt',
    sortOrder: parsedQuery.sortOrder,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, 'Users fetched successfully', result));
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const userId = (req as any).user._id;

  const updatedUser = await UserService.updateUserRole(userId, role);

  return res
    .status(200)
    .json(new ApiResponse(200, `Role updated to ${role} successfully`, {user:updatedUser}));
});