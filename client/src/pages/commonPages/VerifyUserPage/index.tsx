import { useVerifyUser } from "@/services/queries/teacherQueries/auth.queries";
import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const VerifyUserPage = () => {
  const [searchParams] = useSearchParams();
  const { mutate: verifyUserMutate } = useVerifyUser();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const verifyUserHandler = useCallback((token:string) => {
    verifyUserMutate(
      { token: token },
      {
        onSuccess: () => {
            navigate("/sign-in");
        },
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

export default VerifyUserPage;
