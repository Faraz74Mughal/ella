import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/use-auth";

export function GoogleLoginButton() {
  const { mutate } = useGoogleLogin();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            throw new Error("No credential received");
          }
          mutate(credentialResponse.credential);
        }}
        onError={() => toast.error("Google Login Failed")}
      />
    </div>
  );
}
