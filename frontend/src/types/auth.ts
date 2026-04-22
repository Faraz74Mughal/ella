export type UserRole = "admin" | "teacher" | "student" | "pending";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  accountStatus: string;
  isEmailVerified: boolean;
  authProvider?: string;
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
