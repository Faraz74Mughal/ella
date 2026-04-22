export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PENDING: "pending",
} as const;

export const ACCOUNT_STATUS = {
  PENDING: "pending", // Teacher awaiting approval
  AWAITING: "awaiting", // Teacher awaiting approval
  ACTIVE: "active", // Approved or standard user
  BLOCKED: "blocked", // Suspended by Admin
  REJECTED: "rejected", // Teacher application denied
} as const;

export const AUTH_PROVIDERS = {
  LOCAL: "local",
  GOOGLE: "google",
  FACEBOOK: "facebook",
} as const;