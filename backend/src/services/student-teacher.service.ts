import mongoose from "mongoose";
import { USER_ROLES } from "../constants/user.constant";
import { StudentTeacher } from "../models/studentTeacher.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

const MAX_TEACHER_SELECTION = 3;
const LOCK_DAYS = 7;
const LOCK_MS = LOCK_DAYS * 24 * 60 * 60 * 1000;

const LOCK_MESSAGE =
  "You cannot change this teacher until 7 days have passed since enrollment.";

export class StudentTeacherService {
  static async addTeacher(studentId: string, teacherId: string) {
    const session = await mongoose.startSession();
    let relationId: string | null = null;

    try {
      await session.withTransaction(async () => {
        const student = await User.findOne({
          _id: studentId,
          role: USER_ROLES.STUDENT,
          isDeleted: false,
        }).session(session);

        if (!student) {
          throw new ApiError(404, "Student not found.");
        }

        const teacher = await User.findOne({
          _id: teacherId,
          role: USER_ROLES.TEACHER,
          isDeleted: false,
        }).session(session);

        if (!teacher) {
          throw new ApiError(404, "Teacher not found.");
        }

        // Serialize concurrent selection attempts for the same student.
        await User.updateOne(
          { _id: studentId },
          { $set: { updatedAt: new Date() } },
          { session },
        );

        const existingRelation = await StudentTeacher.findOne({
          studentId,
          teacherId,
          removedAt: null,
        }).session(session);

        if (existingRelation) {
          throw new ApiError(409, "Teacher is already assigned to this student.");
        }

        const activeTeacherCount = await StudentTeacher.countDocuments({
          studentId,
          removedAt: null,
        }).session(session);

        if (activeTeacherCount >= MAX_TEACHER_SELECTION) {
          throw new ApiError(400, "A student can enroll in maximum 3 teachers.");
        }

        const createdRelations = await StudentTeacher.create(
          [
            {
              studentId,
              teacherId,
              assignedAt: new Date(),
            },
          ],
          { session },
        );

        relationId = createdRelations[0]._id.toString();
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ApiError(409, "Teacher is already assigned to this student.");
      }
      throw error;
    } finally {
      await session.endSession();
    }

    if (!relationId) {
      throw new ApiError(500, "Failed to assign teacher.");
    }

    const relation = await StudentTeacher.findById(relationId).populate(
      "teacherId",
      "name email username",
    );

    return relation;
  }

  static async removeTeacher(studentId: string, teacherId: string) {
    const relation = await StudentTeacher.findOne({
      studentId,
      teacherId,
      removedAt: null,
    });

    if (!relation) {
      throw new ApiError(404, "Teacher assignment not found for this student.");
    }

    const lockUntil = new Date(relation.assignedAt.getTime() + LOCK_MS);
    const now = new Date();

    if (now < lockUntil) {
      const remainingMs = lockUntil.getTime() - now.getTime();
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      throw new ApiError(423, LOCK_MESSAGE, {
        remainingSeconds,
        lockUntil,
      });
    }

    relation.removedAt = now;
    await relation.save();

    return {
      teacherId,
      removedAt: now,
    };
  }

  static async getStudentTeachers(studentId: string) {
    const relations = await StudentTeacher.find({
      studentId,
      removedAt: null,
    })
      .populate("teacherId", "name email username")
      .sort({ assignedAt: -1 });

    return relations;
  }

  static async getTeacherStudents(teacherId: string) {
    const relations = await StudentTeacher.find({
      teacherId,
      removedAt: null,
    })
      .populate("studentId", "name email username")
      .sort({ assignedAt: -1 });

    return relations;
  }

  static async getTeacherStudentDetails(teacherId: string, studentId: string) {
    const relation = await StudentTeacher.findOne({
      teacherId,
      studentId,
      removedAt: null,
    }).populate("studentId", "name email username role accountStatus");

    if (!relation) {
      throw new ApiError(404, "This student is not assigned to the teacher.");
    }

    return relation;
  }
}
