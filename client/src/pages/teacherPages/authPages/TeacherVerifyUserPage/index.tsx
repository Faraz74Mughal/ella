import { useVerifyUser } from "@/services/queries/teacherQueries/auth.queries";
import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const TeacherVerifyUserPage = () => {
  const [searchParams] = useSearchParams();
  const { mutate: verifyUserMutate } = useVerifyUser();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  console.log("TOKEN", searchParams.get("token"));

  const verifyUserHandler = useCallback((token) => {
    verifyUserMutate(
      { token: token },
      {
        onSuccess: (response) => {
          if ((response as { success: boolean })?.success) {
            console.log("RESPONSE:", response);
console.log("CEGCKHERE",response);

            toast.success(
              (response as { message: { text: string } })?.message?.text || ""
            );
            navigate("/teacher/sign-in");
          }
        }
      }
    );
  }, [verifyUserMutate,navigate]);

  useEffect(() => {
    if (token) {
      verifyUserHandler(token)
    }
  }, [token,verifyUserHandler]);
  return <div></div>;
};

export default TeacherVerifyUserPage;
