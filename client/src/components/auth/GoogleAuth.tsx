import { GOOGLE_AUTH_USER_INFO_LINK } from "@/config";
import { useGoogleSignIn } from "@/services/queries/teacherQueries/auth.queries";
import { EUserRole, GoogleJwtPayload } from "@/types/userType";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { Button } from "../ui/button";

const GoogleAuth = () => {
  const { mutate: googleSignInMutate } = useGoogleSignIn();
  const [isGoogleDropdown, setIsGoogleDropdown] = useState<boolean>(false);
  const [role, setRole] = useState<string>("student")

  const googleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        googleRef.current &&
        !googleRef.current.contains(event.target as Node)
      ) {
        setIsGoogleDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleGoogleLoginSuccess = async (tokenResponse: TokenResponse) => {
    try {
      const userResponse: GoogleJwtPayload = await axios
        .get(GOOGLE_AUTH_USER_INFO_LINK, {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })
        .then((res) => res.data);

      if (userResponse.email_verified === false) {
        toast.warning(
          "Google email not verified! Please verify your email with Google and try again."
        );
        return;
      }
      if (userResponse) {
        googleSignInMutate({ ...userResponse,role:role });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleGoogleLoginFailure = (error: unknown) => {
    console.error("Google Login Failed:", error);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginFailure
  });

  return (
    <div ref={googleRef} className=" block relative">
      <Button
        onClick={() => setIsGoogleDropdown((state: boolean) => !state)}
        variant="outline"
        className="w-full"
      >
        <AnimatePresence>
          {isGoogleDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              // className="absolute left-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50"
              className="absolute top-10 flex justify-center mb-10 "
            >
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  setRole(EUserRole.TEACHER)
                  login()
                }}
                className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-1.5 rounded-s-lg border text-nowrap"
              >
                As a Teacher
              </div>
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  setRole(EUserRole.STUDENT)
                  login()
                }}
                className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-1.5 rounded-e-lg border text-nowrap"
              >
                 As a Student
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FaGoogle /> Google
      </Button>
    </div>
  );
};

export default GoogleAuth;
