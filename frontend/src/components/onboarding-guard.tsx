import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  // If logged in but no role assigned yet, force them to choose
  if (isAuthenticated && user?.role === 'pending') {
    return <Navigate to="/onboarding/select-role" replace />;
  }

  return <>{children}</>;
};