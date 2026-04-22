import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ACCOUNT_STATUS } from "@/constants/user.constant";

export const StatusGuard = ({ allowedStatus }: { allowedStatus: string[] }) => {
  const { user } = useAuthStore();

  if (user?.accountStatus === ACCOUNT_STATUS.PENDING) {
    return <Navigate to="/teacher/awaiting-approval" replace />;
  }
  if (user?.accountStatus === ACCOUNT_STATUS.AWAITING) {
    return <Navigate to="/teacher/apply" replace />;
  }

  if (user?.accountStatus === ACCOUNT_STATUS.REJECTED) {
    return <Navigate to="/teacher/rejected" replace />;
  }

  if (!allowedStatus.includes(user?.accountStatus || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
