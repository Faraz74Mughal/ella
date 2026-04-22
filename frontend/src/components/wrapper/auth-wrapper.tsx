import { ACCOUNT_STATUS, USER_ROLES } from "@/constants/user.constant";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const targetPath = (role: string, status: string) => {
  return role === USER_ROLES.PENDING
    ? "/onboarding/select-role"
    : role === USER_ROLES.TEACHER && status === ACCOUNT_STATUS.AWAITING
      ? "/teacher/apply"
      : role === USER_ROLES.TEACHER && status === ACCOUNT_STATUS.PENDING
        ? "/teacher/awaiting-approval"
        : role
          ? `/${role}/dashboard`
          : "/login";
};

const publicPaths = ["/login", "/register", "/unauthorized", "/server-not-running"];

export const AuthWrapper = () => {
  const { checkAuth, user } = useAuthStore(); // Assuming your store has a loading state
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsReady(true);
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isReady) return;
    if (user) {
      if (location.pathname === "/login") {
        const path = targetPath(user.role, user.accountStatus);
        navigate(path, { replace: true });
      }
    } else {
      const isPublicRoute =
        publicPaths.includes(location.pathname) ||
        location.pathname.startsWith("/verify-email/");
      if (!isPublicRoute) {
        navigate("/login", { replace: true });
      }
    }
  }, [user, isReady, location.pathname, navigate]);

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading Application...</p>
      </div>
    );
  }

  return <Outlet />;
};
