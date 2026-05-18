import type { User } from "./auth";

export interface IAssignmentTeacher {
  _id: string;
  name: string;
  username: string;
  email: string;
}

export interface IAssignmentSubmission {
  _id: string;
  assignment: string | IAssignment;
  student: User;
  document_url: string;
  document_name?: string;
  status: "submitted" | "graded";
  score_obtained?: number;
  percentage?: number;
  points_awarded?: number;
  xp_awarded?: number;
  feedback?: string;
  graded_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAssignment {
  _id: string;
  teacher: IAssignmentTeacher | User;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_marks: number;
  xp_total: number;
  is_published: boolean;
  status?: "upcoming" | "active" | "ended";
  can_submit?: boolean;
  best_percentage?: number;
  submission?: IAssignmentSubmission | null;
  createdAt?: string;
}

export interface CreateAssignmentPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_marks: number;
  xp_total?: number;
}

export interface GradeAssignmentPayload {
  score_obtained: number;
  feedback?: string;
}
