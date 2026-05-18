import { Types } from "mongoose";

export interface IAssignment {
  teacher: Types.ObjectId;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  total_marks: number;
  xp_total: number;
  is_published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AssignmentStatus = "upcoming" | "active" | "ended";
