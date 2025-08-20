import { STORAGE_KEY } from "@/config";
import authService from "@/services/api/teacherApi/auth.service";
import { TSignIn, TToken } from "@/types/userType";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";



export const useSignIn = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn:async (data: TSignIn) => await authService.signIn(data),
      onSuccess:(response)=>{
        if(response.success){
          localStorage.setItem(STORAGE_KEY, response?.data?.token);
          navigate("/teacher");
        }
        return response},
  }
);
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async(data: TSignIn) =>await authService.signUp(data)
  });
};


export const useVerifyUser = () => {
  return useMutation({
    mutationFn: async(data: TToken) =>await authService.verifyUser(data)
  });
};
