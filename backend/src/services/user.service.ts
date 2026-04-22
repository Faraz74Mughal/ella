import { USER_ROLES } from '../constants/user.constant';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { applyQueryFeatures } from '../utils/queryFeatures';

type SortOrder = 'asc' | 'desc';

type GetUsersParams = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  accountStatus?: string;
  authProvider?: string;
  isEmailVerified?: boolean;
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'username' | 'lastLoginAt';
  sortOrder: SortOrder;
};

export class UserService {
  static async getAllUsers(params: GetUsersParams) {
    const result = await applyQueryFeatures({
      model: User,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      search: params.search,
      searchFields: ['name', 'email', 'username'],
      filters: {
        role: params.role,
        accountStatus: params.accountStatus,
        authProvider: params.authProvider,
        isEmailVerified: params.isEmailVerified,
      },
      baseFilter: { isDeleted: false },
      select:
        '-password -refreshToken -emailVerificationToken -resetPasswordToken -resetPasswordExpire',
      allowedSortFields: [
        'createdAt',
        'updatedAt',
        'name',
        'email',
        'username',
        'lastLoginAt',
      ],
    });

    return {
      users: result.items,
      pagination: {
        totalResult: result.pagination.total,
        totalPages: result.pagination.totalPages,
        currentPage: result.pagination.page,
        limit: result.pagination.limit,
        hasNextPage: result.pagination.hasNextPage,
        hasPrevPage: result.pagination.hasPrevPage,
      },
    };
  }

  static async updateUserRole(userId: string, newRole: string) {
    // 1. Security Check: Prevent self-promotion to Admin
    if (newRole === USER_ROLES.ADMIN) {
      throw new ApiError(403, "You cannot assign the Admin role to yourself.");
    }

    // 2. Validate the role exists in our defined roles
    const validRoles = [USER_ROLES.STUDENT as string, USER_ROLES.TEACHER as string];
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, "Invalid role selection.");
    }

    // 3. Update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role: newRole } },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User not found.");

    return user;
  }
}