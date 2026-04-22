export type UserRole = "admin" | "teacher" | "student" | "pending";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  accountStatus: string;
  isEmailVerified: boolean;
  authProvider?: string;

  username?: string;
  providerId?: string;
  bio?: string;
  dob?: Date;
  contactNo?: string;
  rejectionReason?: string;
  teacherProfile?: {
    resumeUrl?: string;
    educationDocuments?: string;
    idProof?: {
      front?: string;
      back?: string;
    };
  };
  isDeleted?: boolean;
  lastLoginAt?: Date;
}
