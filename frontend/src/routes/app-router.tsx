import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route";
import { RoleGuard } from "./guards/RoleGuard";

// Pages
import LoginPage from "@/pages/auth/login";
import SelectRolePage from "@/pages/onboarding/select-role";
import { AuthWrapper } from "@/components/wrapper/auth-wrapper";
import TeacherOnboarding from "@/pages/teacher/onboarding/page";
import AwaitingApprovalPage from "@/pages/teacher/onboarding/awaiting-approval";
import { StatusGuard } from "./guards/StatusGuard";
import RegisterPage from "@/pages/auth/register";
import VerifyEmailPage from "@/pages/auth/verify-email";
import { TeacherPortalLayout } from "@/layouts/teacher-portal-layout";
import TeacherDashboardPage from "@/pages/teacher/dashboard";
import TeacherCoursesPage from "@/pages/teacher/courses";
import TeacherProgressPage from "@/pages/teacher/progress";
import TeacherSettingsPage from "@/pages/teacher/settings";
import StudentDashboardPage from "@/pages/student/dashboard";
import { AdminPortalLayout } from "@/layouts/admin-portal-layout";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users/users-page";
import AdminApprovalsPage from "@/pages/admin/approvals";
import AdminSettingsPage from "@/pages/admin/settings";
import ServerNotRunningPage from "@/pages/server-not-running";
import AdminLessonsPage from "@/pages/admin/lessons/lessons-page";
import AdminLessonsAddPage from "@/pages/admin/lessons/lesson-add-page"
import AdminLessonsEditPage from "@/pages/admin/lessons/lesson-edit-page";

const Unauthorized = () => <div>Unauthorized Access</div>;

const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      /* --- PUBLIC ROUTES --- */
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/verify-email/:token", element: <VerifyEmailPage /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      { path: "/server-not-running", element: <ServerNotRunningPage /> },

      /* --- AUTHENTICATED ROUTES (Must be Logged In) --- */
      {
        element: <ProtectedRoute />,
        children: [
          // 1. Onboarding (User has no role yet)
          { path: "/onboarding/select-role", element: <SelectRolePage /> },

          // 2. Role-Validated Routes (Must have a role + Correct Role)
          {
            element: <RoleGuard />, // Prevents 'Pending' users from seeing dashboards
            children: [
              // Admin Branch
              {
                path: "/admin",
                element: <ProtectedRoute allowedRoles={["admin"]} />,
                children: [
                  {
                    element: <AdminPortalLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      { path: "dashboard", element: <AdminDashboardPage /> },
                      { path: "lessons", element: <AdminLessonsPage /> },
                      { path: "lessons/add", element: <AdminLessonsAddPage /> },
                      { path: "lessons/edit/:id", element: <AdminLessonsEditPage /> },
                      { path: "users", element: <AdminUsersPage /> },
                      { path: "approvals", element: <AdminApprovalsPage /> },
                      { path: "settings", element: <AdminSettingsPage /> },
                    ],
                  },
                ],
              },
              // Teacher Branch
              {
                path: "/teacher",
                element: <ProtectedRoute allowedRoles={["teacher"]} />,
                children: [
                  {
                    // A special sub-guard for status
                    element: <StatusGuard allowedStatus={["active"]} />,
                    children: [
                      {
                        element: <TeacherPortalLayout />,
                        children: [
                          { path: "dashboard", element: <TeacherDashboardPage /> },
                          { path: "courses", element: <TeacherCoursesPage /> },
                          { path: "progress", element: <TeacherProgressPage /> },
                          { path: "settings", element: <TeacherSettingsPage /> },
                          { path: "", element: <Navigate to="dashboard" replace /> },
                        ],
                      },
                    ],
                  },
                  // This is accessible even if status is pending
                  {
                    path: "awaiting-approval",
                    element: <AwaitingApprovalPage />,
                  },
                  { path: "apply", element: <TeacherOnboarding /> },
                ],
              },
              // Student Branch
              {
                path: "/student",
                element: <ProtectedRoute allowedRoles={["student"]} />,
                children: [
                  { path: "dashboard", element: <StudentDashboardPage /> },
                  { path: "", element: <Navigate to="dashboard" replace /> },
                ],
              },
            ],
          },

          // Default Global Redirect
          { path: "/", element: <Navigate to="/login" replace /> },
        ],
      },

      /* --- 404 CATCH ALL --- */
      { path: "*", element: <div>Page Not Found</div> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
