import api from "./client";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateAssignmentPayload,
  GradeAssignmentPayload,
  IAssignment,
  IAssignmentSubmission,
} from "@/types/assignment";

const assignmentBase = "/assignments";

export const assignmentService = {
  fetchTeacherAssignments: async (): Promise<IAssignment[]> => {
    const response = await api.get<ApiResponse<{ assignments: IAssignment[] }>>(
      `${assignmentBase}/teacher`,
    );
    return response?.data?.data?.assignments || [];
  },

  fetchAdminAssignments: async (): Promise<IAssignment[]> => {
    const response = await api.get<ApiResponse<{ assignments: IAssignment[] }>>(
      `${assignmentBase}/admin`,
    );
    return response?.data?.data?.assignments || [];
  },

  fetchStudentAssignments: async (): Promise<IAssignment[]> => {
    const response = await api.get<ApiResponse<{ assignments: IAssignment[] }>>(
      `${assignmentBase}/student`,
    );
    return response?.data?.data?.assignments || [];
  },

  fetchTeacherSubmissions: async (): Promise<IAssignmentSubmission[]> => {
    const response = await api.get<ApiResponse<{ submissions: IAssignmentSubmission[] }>>(
      `${assignmentBase}/teacher/submissions`,
    );
    return response?.data?.data?.submissions || [];
  },

  createAssignment: async (data: CreateAssignmentPayload): Promise<IAssignment> => {
    const response = await api.post<ApiResponse<{ assignment: IAssignment }>>(
      `${assignmentBase}/teacher`,
      data,
    );
    return response?.data?.data?.assignment;
  },

  submitAssignment: async (assignmentId: string, file: File): Promise<IAssignmentSubmission> => {
    const formData = new FormData();
    formData.append("document", file);

    const response = await api.post<ApiResponse<{ submission: IAssignmentSubmission }>>(
      `${assignmentBase}/student/${assignmentId}/submit`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response?.data?.data?.submission;
  },

  gradeSubmission: async ({
    submissionId,
    data,
  }: {
    submissionId: string;
    data: GradeAssignmentPayload;
  }): Promise<IAssignmentSubmission> => {
    const response = await api.patch<ApiResponse<{ submission: IAssignmentSubmission }>>(
      `${assignmentBase}/teacher/submissions/${submissionId}/grade`,
      data,
    );
    return response?.data?.data?.submission;
  },
};
