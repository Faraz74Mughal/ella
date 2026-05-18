import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { saveOnCloudinary } from "../config/cloudinary";
import { Report } from "../models/report.model";
import { TUpdatePassword } from "../types/user.type";
import { StudentProgress } from "../models/studentProgress.model";
import { Assignment } from "../models/assignment.model";
import { StudentTeacher } from "../models/studentTeacher.model";

export class TeacherService {
  static async reportStudent(
    reporterId: string,
    studentId: string,
    reason: string,
  ) {
    // 1. Validate the student actually exists
    const student = await User.findById(studentId);
    if (!student) {
      throw new ApiError(
        404,
        "The student you are trying to report does not exist.",
      );
    }

    // 2. Create the report
    const report = await Report.create({
      reporterId,
      reportedUserId: studentId,
      reason,
      status: "pending", // Default status from our schema
    });

    return report;
  }
  static async applyAsTeacher(
    body: { userId: string; bio: string },
    files: any,
  ) {
    // 1. Validate files exist
    const resumeLocalPath = files?.resume?.[0]?.path;
    const idFrontLocalPath = files?.idFront?.[0]?.path;
    const idBackLocalPath = files?.idBack?.[0]?.path;

    if (!resumeLocalPath || !idFrontLocalPath || !idBackLocalPath) {
      throw new ApiError(
        400,
        "Resume, ID Front, and ID Back are all required.",
      );
    }

    // 2. Upload to Cloudinary
    const resume = await saveOnCloudinary(resumeLocalPath, "teachers/documents");
    const idFront = await saveOnCloudinary(idFrontLocalPath, "teachers/documents");
    const idBack = await saveOnCloudinary(idBackLocalPath, "teachers/documents");

    if (!resume || !idFront || !idBack) {
      throw new ApiError(500, "Error while uploading documents.");
    }

    // 3. Update User Profile
    const user = await User.findByIdAndUpdate(
      body.userId,
      {
        $set: {
          bio: body.bio,
          "teacherProfile.resumeUrl": resume.url,
          "teacherProfile.idProof.front": idFront.url,
          "teacherProfile.idProof.back": idBack.url,
          accountStatus: "pending", // Set to pending for Admin review
        },
      },
      { new: true },
    );
    return user;
  }

  static async updatePassword(body: TUpdatePassword) {
    const user = await User.findById(body.userId).select("+password");
    if(!user) {
      throw new ApiError(404, "User not found.");
    }

    const isPasswordValid = await user.isPasswordCorrect(body.oldPassword);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password.");
    }

    user.password = body.newPassword;
    user.isPasswordNeedToChange = false;
    await user.save({ validateBeforeSave: false });

    return user;
  }

  static async getTeacherDashboardOverview(teacherId: string) {
    const [
      totalAssignments,
      totalUsers,
      totalStudents,
      assignedStudents,
    ] = await Promise.all([
      Assignment.countDocuments({ teacher: teacherId }),
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: "student", isDeleted: false }),
      StudentTeacher.countDocuments({ teacherId, removedAt: null }),
    ]);

    const topStudents = await StudentProgress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "studentUser",
        },
      },
      { $unwind: "$studentUser" },
      {
        $match: {
          "studentUser.role": "student",
          "studentUser.isDeleted": false,
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$studentUser._id",
          name: "$studentUser.name",
          email: "$studentUser.email",
          username: "$studentUser.username",
          total_xp: { $ifNull: ["$total_xp", 0] },
          total_points: { $ifNull: ["$total_points", 0] },
          completed_lessons_count: {
            $size: { $ifNull: ["$completed_lessons", []] },
          },
          current_streak: { $ifNull: ["$current_streak", 0] },
          highest_streak: { $ifNull: ["$highest_streak", 0] },
        },
      },
      { $sort: { total_xp: -1, total_points: -1, name: 1 } },
      { $limit: 10 },
    ]);

    const ranking = topStudents.map((student, index) => ({
      rank: index + 1,
      ...student,
    }));

    return {
      summary: {
        totalAssignments,
        totalUsers,
        totalStudents,
        assignedStudents,
      },
      ranking,
    };
  }

  static async getAllUsersWithProgress() {
    const users = await User.find({ isDeleted: false })
      .select("name username email role accountStatus")
      .sort({ createdAt: -1 })
      .lean();

    const progressRows = await StudentProgress.find({})
      .select(
        "student total_xp total_points current_streak highest_streak completed_lessons assignment_performance",
      )
      .lean();

    const progressMap = new Map(
      progressRows.map((row: any) => [
        row.student?.toString(),
        {
          total_xp: row.total_xp || 0,
          total_points: row.total_points || 0,
          current_streak: row.current_streak || 0,
          highest_streak: row.highest_streak || 0,
          completed_lessons_count: (row.completed_lessons || []).length,
          assignment_average:
            row.assignment_performance?.average_percentage || 0,
        },
      ]),
    );

    const usersWithProgress = users
      .map((user: any) => {
        const progress = progressMap.get(user._id.toString());
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          progress: progress || {
            total_xp: 0,
            total_points: 0,
            current_streak: 0,
            highest_streak: 0,
            completed_lessons_count: 0,
            assignment_average: 0,
          },
        };
      })
      .sort((a, b) => b.progress.total_xp - a.progress.total_xp);

    return {
      total: usersWithProgress.length,
      users: usersWithProgress,
    };
  }
}
