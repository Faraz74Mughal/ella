import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../config/cloudinary";
import { Report } from "../models/report.model";

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
    const resume = await uploadOnCloudinary(resumeLocalPath);
    const idFront = await uploadOnCloudinary(idFrontLocalPath);
    const idBack = await uploadOnCloudinary(idBackLocalPath);

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
}
