import { Report } from '../models/report.model';
import { User } from '../models/user.model';
import { ACCOUNT_STATUS } from '../constants/user.constant';
import { ApiError } from '../utils/ApiError';

export class AdminService {
  static async updateTeacherStatus(
    teacherId: string, 
    status: 'active' | 'rejected', 
    reason?: string
  ) {
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      throw new ApiError(404, "Teacher record not found");
    }

    teacher.accountStatus = status === 'active' ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.REJECTED;
    
    if (status === 'rejected') {
      if (!reason) throw new ApiError(400, "Rejection reason is required");
      teacher.rejectionReason = reason;
    } else {
      teacher.rejectionReason = undefined; // Clear reason on approval
    }

    await teacher.save();
    return teacher;
  }

  static async getAllPendingTeachers() {
    return await User.find({ 
      role: 'teacher', 
      accountStatus: ACCOUNT_STATUS.PENDING 
    });
  }

  static async toggleUserBlockStatus(userId: string, status: 'active' | 'blocked', adminNotes?: string) {
    const user = await User.findById(userId);
    
    if (!user) throw new ApiError(404, "User not found");
    if (user.role === 'admin') throw new ApiError(403, "Admins cannot be blocked");

    user.accountStatus = status === 'active' ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.BLOCKED;
    await user.save();

    // If we are blocking based on a report, we should update the report status
    // (This is usually handled in the controller by passing the reportId)
    return user;
  }

  static async getAllReports() {
    // We 'populate' to see the names of the reporter and the target
    return await Report.find()
      .populate('reporterId', 'name email role')
      .populate('reportedUserId', 'name email role accountStatus')
      .sort({ createdAt: -1 });
  }

  static async resolveReport(reportId: string, status: 'action_taken' | 'dismissed', adminNotes: string) {
    const report = await Report.findById(reportId);
    if (!report) throw new ApiError(404, "Report not found");

    report.status = status;
    report.adminNotes = adminNotes;
    await report.save();
    
    return report;
  }
}