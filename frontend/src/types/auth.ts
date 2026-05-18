export type UserRole = "admin" | "teacher" | "student" | "pending";

export interface User {
  _id: string;
  email: string;
  name: string;
  username?: string;
  role: UserRole;
  image?: string;
  imagePublicId?: string;
  bio?: string;
  dob?: string;
  contactNo?: string;
  language?: string;
  accountStatus: string;
  isEmailVerified: boolean;
  authProvider?: string;
  isPasswordNeedToChange?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
