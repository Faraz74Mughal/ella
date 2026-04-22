import { Document, Types } from "mongoose";

export interface IStudentTeacher extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  assignedAt: Date;
  removedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
