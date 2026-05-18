import { Types } from "mongoose";

export interface IAssignmentSubmission {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  document_url: string;
  document_public_id?: string;
  document_name?: string;
  status: "submitted" | "graded";
  score_obtained?: number;
  percentage?: number;
  points_awarded?: number;
  xp_awarded?: number;
  feedback?: string;
  graded_by?: Types.ObjectId;
  submitted_at: Date;
  graded_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
