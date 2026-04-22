import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/api/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_STATUS, USER_ROLES } from "@/constants/user.constant";

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data);
      const from =
        data.role.toLowerCase() === "pending" && "/onboarding/select-role";
      if (from) navigate(from);
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data);
      console.log("data?.role", data?.role);

      const target =
        data?.role === USER_ROLES.PENDING
          ? "/onboarding/select-role"
          : data?.role === USER_ROLES.TEACHER &&
              data?.accountStatus === ACCOUNT_STATUS.AWAITING
            ? "/teacher/apply"
            : data?.role === USER_ROLES.TEACHER &&
                data?.accountStatus === ACCOUNT_STATUS.PENDING
              ? "awaiting-approval"
              : "/student/dashboard";
      setAuth(data);
      navigate(target);
    },
  });
}

export function useGoogleLogin() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      console.log("dat",data);
      
      const target =
        data?.role === USER_ROLES.PENDING
          ? "/onboarding/select-role"
          : data?.role === USER_ROLES.TEACHER
            ? "/teacher/apply"
            : "/student/dashboard";
      setAuth(data);
      navigate(target, { state: data });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Authentication failed");
    },
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: authService.getCurrentUser,
  });
}

export function useAssignRole() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data: { _id: string; role: string }) =>
      authService.assignRole(data._id, data.role),
    onSuccess: (data) => {
      console.log("Data", data);

      if (
        data.role === USER_ROLES.TEACHER &&
        data.accountStatus === ACCOUNT_STATUS.AWAITING &&
        data.isEmailVerified
      ) {
        setAuth(data);
        navigate("/teacher/apply");
        return;
      }
      if(data.authProvider!=="local"&&data.role===USER_ROLES.STUDENT){
        setAuth(data);
        navigate("/student/dashboard");
        return;
      }
      setAuth(null);
      navigate("/login");
    },
  });
}

export function useVerifyEmail() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      navigate("/login");
    },
  });
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),
  });
}
