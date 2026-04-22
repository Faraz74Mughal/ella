import { userService } from "@/api/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { IPagination } from "@/types/pagination";
import type { IUser } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRole() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: userService.updateRole,
    onSuccess: (data) => {
      console.log("DATA", data);

      setAuth(data as IUser);
      toast.success("Role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
}

export function useGetUsersByAdmin(tableData:IPagination) {
  
  return useQuery({
    queryKey:["admin-user-fetch",tableData],
    queryFn: () => userService.fetchUsersByAdmin(tableData as IPagination),
    
  });
}
