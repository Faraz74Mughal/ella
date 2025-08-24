import { STORAGE_KEY } from "@/config";
import authService from "@/services/api/teacherApi/auth.service";
import { FacebookJwtPayload, GoogleJwtPayload, TSignIn, TToken } from "@/types/userType";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: TSignIn) => await authService.signIn(data),
    onSuccess: (response) => {
      if (response.success) {
        const data = JSON.stringify({
          token: response?.data?.token,
          refreshToken: response?.data?.refreshToken
        });
        localStorage.setItem(STORAGE_KEY, data);
        navigate("/teacher");
      }
      return response;
    }
  });
};

export const useGoogleSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: GoogleJwtPayload) => await authService.googleSignIn(data),
    onSuccess: (response) => {
      if (response.success) {
        const data = JSON.stringify({
          token: response?.data?.token,
          refreshToken: response?.data?.refreshToken
        });
        localStorage.setItem(STORAGE_KEY, data);
        navigate("/teacher");
      }
      return response;
    }
  });
};


export const useFacebookSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: FacebookJwtPayload) => await authService.facebookSignIn(data),
    onSuccess: (response) => {
      if (response.success) {
        const data = JSON.stringify({
          token: response?.data?.token,
          refreshToken: response?.data?.refreshToken
        });
        localStorage.setItem(STORAGE_KEY, data);
        navigate("/teacher");
      }
      return response;
    }
  });
};


export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: TSignIn) => await authService.signUp(data)
  });
};

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: async (data: TToken) => await authService.verifyUser(data)
  });
};
