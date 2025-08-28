import { FACEBOOK_AUTH_ID } from "@/config";
import { useFacebookSignIn } from "@/services/queries/teacherQueries/auth.queries";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebook } from "react-icons/fa6";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EUserRole } from "@/types/userType";

const FacebookAuth = () => {

  const { mutate: facebookSignInMutate } = useFacebookSignIn();
  const [isFacebookDropdown, setIsFacebookDropdown] = useState<boolean>(false)
  // const [role, setRole]  = useState<string>("student")
  const roleRef = useRef<EUserRole>(EUserRole.STUDENT);
  const facebookRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facebookRef.current &&
        !facebookRef.current.contains(event.target as Node)
      ) {
        setIsFacebookDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <FacebookLogin
        appId={FACEBOOK_AUTH_ID}
        //     onSuccess={(response) => {
        //     console.log('Login Success!', response);
        //   }}
        onFail={(error) => {
          console.log("Login Failed!", error);
        }}
        onProfileSuccess={(response) => {
          const data = {
            firstName: response.name!.split(" ")[0],
            lastName: response.name!.split(" ")?.[1] || "",
            email: response.email!,
            picture: response.picture?.data?.url,
            role: roleRef.current
          };
          facebookSignInMutate(data);
          console.log("Get Profile Success!", response);
        }}
        render={({ onClick }) => (
          <div ref={facebookRef} className=" block relative">
            <Button
              onClick={() => setIsFacebookDropdown((state: boolean) => !state)}
              variant="outline"
              className="w-full"
            >
              <AnimatePresence>
                {isFacebookDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    // className="absolute left-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50"
                    className="absolute top-10 flex justify-center mb-10 "
                  >
                    <div
                      onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => {
                        e.stopPropagation();
                        roleRef.current = EUserRole.TEACHER
                        // setRole(()=> EUserRole.TEACHER);
                        onClick?.()
                      }}
                      className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-1.5 rounded-s-lg border text-nowrap"
                    >
                    As a Teacher
                    </div>
                    <div
                      onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => {
                        e.stopPropagation();
                        roleRef.current = EUserRole.STUDENT
                        // setRole(()=> EUserRole.STUDENT)
                        onClick?.()
                      }}
                      className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-1.5 rounded-e-lg border text-nowrap"
                    >
                    As a Student
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <FaFacebook /> Facebook
            </Button>
          </div>
        )}
      />
    </>
  );
};

export default FacebookAuth;
