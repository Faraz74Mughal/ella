import { ACCOUNT_STATUS, USER_ROLES } from "../constants/user.constant";
import { User } from "../models/user.model";
import { IUser } from "../types/user.type";
import { ApiError } from "../utils/ApiError";
import { getTeacherWelcomeTemplate } from "../utils/emailTemplates";
import { applyQueryFeatures } from "../utils/queryFeatures";
import generateRandomPassword from "../utils/randomPasswordGenerate";
import { MailService } from "./mail.service";

type SortOrder = "asc" | "desc";

type GetUsersParams = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  accountStatus?: string;
  authProvider?: string;
  isEmailVerified?: boolean;
  sortBy:
    | "createdAt"
    | "updatedAt"
    | "name"
    | "email"
    | "username"
    | "lastLoginAt";
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
      searchFields: ["name", "email", "username"],
      filters: {
        role: params.role,
        accountStatus: params.accountStatus,
        authProvider: params.authProvider,
        isEmailVerified: params.isEmailVerified,
      },
      baseFilter: { isDeleted: false },
      select:
        "-password -refreshToken -emailVerificationToken -resetPasswordToken -resetPasswordExpire",
      allowedSortFields: [
        "createdAt",
        "updatedAt",
        "name",
        "email",
        "username",
        "lastLoginAt",
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
    const validRoles = [
      USER_ROLES.STUDENT as string,
      USER_ROLES.TEACHER as string,
    ];
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, "Invalid role selection.");
    }

    // 3. Update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role: newRole } },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User not found.");

    return user;
  }

  static async teacherAdd(userData: Partial<IUser>) {
    // 1. Check if user already exists
    console.log("Checking for existing user with email:", userData.email);
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists",
      );
    }

    console.log("User Existence Check Passed. Proceeding to create teacher with data:", userData);

    const randomPassword = generateRandomPassword(8);
    
    // 3. Create User
    let user = await User.create({
      ...userData,
      role: USER_ROLES.TEACHER,
      password: randomPassword,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
      isPasswordNeedToChange: true,
    });
    const htmlBody = getTeacherWelcomeTemplate(
      user.name,
      user.email,
      randomPassword,
      process.env.LOGIN_URL || "http://localhost:5173/login",
    );
    const userResponse = user.toObject();
    delete userResponse.password;

    await MailService.send({
      to: user.email,
      subject: "Welcome to Ella - Your Teacher Account is Ready!",
      html: htmlBody,
    });
    return userResponse;
  }
}
