import mongoose from "mongoose";
import { Assignment } from "../models/assignment.model";
import { AssignmentSubmission } from "../models/assignment-submission.model";
import { User } from "../models/user.model";
import { StudentProgressService } from "./student-progress.service";
import { checkAndUnlockAchievements } from "../utils/achievements";
import { ApiError } from "../utils/ApiError";
import { saveOnCloudinary } from "../config/cloudinary";

type AssignmentPayload = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_marks: number;
  xp_total?: number;
};

type GradePayload = {
  score_obtained: number;
  feedback?: string;
};

const buildAssignmentStatus = (startDate: Date, endDate: Date) => {
  const now = new Date();
  if (now < startDate) return "upcoming" as const;
  if (now > endDate) return "ended" as const;
  return "active" as const;
};

const recalculateAssignmentPerformance = (progress: any) => {
  const bestScores = progress.assignment_best_scores || [];
  const averagePercentage =
    bestScores.length > 0
      ? bestScores.reduce(
          (sum: number, item: any) => sum + (Number(item.best_percentage) || 0),
          0,
        ) / bestScores.length
      : 0;

  progress.assignment_performance = {
    average_percentage: Number(averagePercentage.toFixed(2)),
    completed_count: bestScores.length,
  };
};

export class AssignmentService {
  static async createAssignment(teacherId: string, payload: AssignmentPayload) {
    if (!payload.title || !payload.description) {
      throw new ApiError(400, "title and description are required.");
    }

    const startDate = new Date(payload.start_date);
    const endDate = new Date(payload.end_date);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new ApiError(400, "start_date and end_date must be valid dates.");
    }

    if (startDate >= endDate) {
      throw new ApiError(400, "end_date must be after start_date.");
    }

    const totalMarks = Number(payload.total_marks);
    if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
      throw new ApiError(400, "total_marks must be greater than 0.");
    }

    const xpTotal = Number.isFinite(Number(payload.xp_total)) && Number(payload.xp_total) > 0
      ? Number(payload.xp_total)
      : totalMarks;

    return await Assignment.create({
      teacher: teacherId,
      title: payload.title,
      description: payload.description,
      start_date: startDate,
      end_date: endDate,
      total_marks: totalMarks,
      xp_total: xpTotal,
      is_published: true,
    });
  }

  static async getTeacherAssignments(teacherId: string) {
    return await Assignment.find({ teacher: teacherId })
      .sort({ createdAt: -1 })
      .populate("teacher", "name username email");
  }

  static async getAdminAssignments() {
    return await Assignment.find()
      .sort({ createdAt: -1 })
      .populate("teacher", "name username email");
  }

  static async getStudentAssignments(studentId: string) {
    const assignments = await Assignment.find({ is_published: true })
      .sort({ start_date: 1 })
      .populate("teacher", "name username email");

    const progress = await StudentProgressService.getStudentProgress(studentId);
    const submissions = await AssignmentSubmission.find({ student: studentId });

    return assignments.map((assignment) => {
      const status = buildAssignmentStatus(
        new Date(assignment.start_date),
        new Date(assignment.end_date),
      );

      const submission = submissions.find(
        (item) => item.assignment.toString() === assignment._id.toString(),
      );

      const best = (progress.assignment_best_scores || []).find(
        (item: any) => item.assignment_id?.toString() === assignment._id.toString(),
      );

      return {
        ...assignment.toObject(),
        status,
        can_submit: status === "active",
        submission: submission || null,
        best_percentage: best?.best_percentage || 0,
      };
    });
  }

  static async submitAssignment(studentId: string, assignmentId: string, file: any) {
    if (!file?.path) {
      throw new ApiError(400, "document file is required.");
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new ApiError(404, "Assignment not found.");
    }

    const now = new Date();
    if (now < assignment.start_date) {
      throw new ApiError(400, "Assignment has not started yet.");
    }

    if (now > assignment.end_date) {
      throw new ApiError(400, "Assignment deadline has ended.");
    }

    const uploaded = await saveOnCloudinary(file.path, "assignments/submissions");

    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignment: assignmentId, student: studentId },
      {
        $set: {
          assignment: assignmentId,
          student: studentId,
          document_url: uploaded.url,
          document_public_id: uploaded.public_id,
          document_name: file.originalname,
          status: "submitted",
          submitted_at: new Date(),
        },
      },
      { new: true, upsert: true },
    ).populate("assignment", "title total_marks xp_total start_date end_date")
      .populate("student", "name username email");

    return submission;
  }

  static async getTeacherSubmissions(teacherId: string) {
    const assignments = await Assignment.find({ teacher: teacherId }).select("_id");
    const assignmentIds = assignments.map((assignment) => assignment._id);

    return await AssignmentSubmission.find({ assignment: { $in: assignmentIds } })
      .sort({ updatedAt: -1 })
      .populate("assignment", "title total_marks xp_total start_date end_date")
      .populate("student", "name username email")
      .populate("graded_by", "name username email");
  }

  static async gradeSubmission(
    teacherId: string,
    submissionId: string,
    payload: GradePayload,
  ) {
    const submission = await AssignmentSubmission.findById(submissionId).populate<{ assignment: any }>(
      "assignment",
      "teacher title total_marks xp_total",
    );

    if (!submission) {
      throw new ApiError(404, "Submission not found.");
    }
console.log("teacherId",teacherId);
console.log("submission",submission.assignment.teacher.toString());

    if (submission.assignment.teacher.toString() !== teacherId?.toString()) {
      throw new ApiError(403, "You can only grade your own assignments.");
    }

    const assignment = submission.assignment;
    const scoreObtained = Number(payload.score_obtained);
    if (!Number.isFinite(scoreObtained) || scoreObtained < 0) {
      throw new ApiError(400, "score_obtained must be a valid non-negative number.");
    }

    const totalMarks = Number(assignment.total_marks) || 0;
    const xpTotal = Number(assignment.xp_total) || totalMarks;
    const percentage = totalMarks > 0 ? Math.min(100, Math.max(0, (scoreObtained / totalMarks) * 100)) : 0;
    const pointsAwarded = scoreObtained;
    const xpAwarded = Math.max(0, Math.round((scoreObtained / (totalMarks || 1)) * xpTotal));

    const progress = await StudentProgressService.getStudentProgress(submission.student.toString());
    if (!progress.assignment_best_scores) {
      progress.assignment_best_scores = [];
    }

    const existingBestIndex = progress.assignment_best_scores.findIndex(
      (item: any) => item.assignment_id?.toString() === submission.assignment._id.toString(),
    );

    const previousAwardPoints = Number(submission.points_awarded || 0);
    const previousAwardXp = Number(submission.xp_awarded || 0);

    progress.total_points = (progress.total_points || 0) - previousAwardPoints + pointsAwarded;
    progress.total_xp = (progress.total_xp || 0) - previousAwardXp + xpAwarded;

    if (existingBestIndex === -1) {
      progress.assignment_best_scores.push({
        assignment_id: submission.assignment._id,
        best_percentage: percentage,
        best_points: pointsAwarded,
        best_xp: xpAwarded,
      } as any);
    } else {
      const existingBest = Number(progress.assignment_best_scores[existingBestIndex].best_percentage) || 0;
      if (percentage > existingBest) {
        progress.assignment_best_scores[existingBestIndex] = {
          assignment_id: submission.assignment._id,
          best_percentage: percentage,
          best_points: pointsAwarded,
          best_xp: xpAwarded,
        } as any;
      }
    }

    recalculateAssignmentPerformance(progress);
    progress.last_activity_at = new Date();
    checkAndUnlockAchievements(progress);
    await progress.save();

    submission.score_obtained = scoreObtained;
    submission.percentage = percentage;
    submission.points_awarded = pointsAwarded;
    submission.xp_awarded = xpAwarded;
    submission.feedback = payload.feedback;
    submission.status = "graded";
    submission.graded_by = new mongoose.Types.ObjectId(teacherId);
    submission.graded_at = new Date();

    await submission.save();

    return submission;
  }
}
