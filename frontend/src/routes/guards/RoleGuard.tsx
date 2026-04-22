import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const RoleGuard = () => {
  const { user, isAuthenticated, status } = useAuthStore();

  if (status === "loading") return null;

  if (isAuthenticated && user?.role === "pending") {
    return <Navigate to="/onboarding/select-role" replace />;
  }

  // If they are already a Student or Teacher, don't let them back into onboarding
  return <Outlet />;
};