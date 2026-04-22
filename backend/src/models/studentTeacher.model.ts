import mongoose, { Model, Schema } from "mongoose";
import { IStudentTeacher } from "../types/student-teacher.type";

const studentTeacherSchema = new Schema<IStudentTeacher>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    removedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

studentTeacherSchema.index(
  { studentId: 1, teacherId: 1 },
  {
    unique: true,
    partialFilterExpression: { removedAt: null },
  },
);

studentTeacherSchema.index({ studentId: 1, removedAt: 1 });
studentTeacherSchema.index({ teacherId: 1, removedAt: 1 });

export const StudentTeacher = mongoose.model<IStudentTeacher, Model<IStudentTeacher>>(
  "StudentTeacher",
  studentTeacherSchema,
);
