import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/ApiResponse';

export const getPendingTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await AdminService.getAllPendingTeachers();
  return res
    .status(200)
    .json(new ApiResponse(200, "Pending teachers fetched", teachers));
});

export const reviewTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const { status, reason } = req.body; // status: 'active' or 'rejected'

  const updatedTeacher = await AdminService.updateTeacherStatus(teacherId as string, status, reason);

  return res
    .status(200)
    .json(new ApiResponse(200, `Teacher ${status} successfully`, updatedTeacher));
});

export const toggleUserBlock = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, adminNotes, reportId } = req.body; // status: 'active' or 'blocked'

  const user = await AdminService.toggleUserBlockStatus(userId as string, status, adminNotes);

  // If this block was the result of a specific report, resolve it
  if (reportId && status === 'blocked') {
    await AdminService.resolveReport(reportId, 'action_taken', adminNotes || "User blocked by admin");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, `User account is now ${status}`, user));
});

// --- View All Reports ---
export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await AdminService.getAllReports();
  return res
    .status(200)
    .json(new ApiResponse(200, "All reports fetched", reports));
});