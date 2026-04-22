import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useVerifyEmail } from "@/hooks/use-auth";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "expired">(
    "loading",
  );
  const { mutate } = useVerifyEmail();
  console.log("token", token);

  useEffect(() => {
    const verify = async () => {
      if (!token) return setStatus("expired");

      try {
        if (token) mutate(token);
        setStatus("success");

        // Auto-redirect to onboarding after 3 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("expired");
      }
    };

    verify();
  }, [ ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="pt-10 pb-10">
          {/* STATE: LOADING */}
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <CardTitle>Verifying your email...</CardTitle>
              <p className="text-muted-foreground">
                Please wait while we secure your account.
              </p>
            </div>
          )}

          {/* STATE: SUCCESS */}
          {status === "success" && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <CardTitle className="text-2xl font-bold text-green-600">
                Email Verified!
              </CardTitle>
              <p className="text-muted-foreground">
                Your account is now active. Redirecting you to pick your role...
              </p>
              <Button asChild className="w-full mt-4">
                <Link to="/onboarding/select-role">Go Now</Link>
              </Button>
            </div>
          )}

          {/* STATE: EXPIRED / INVALID */}
          {status === "expired" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <CardTitle className="text-2xl font-bold">Link Expired</CardTitle>
              <p className="text-muted-foreground">
                This verification link is invalid or has expired. Please request
                a new one.
              </p>
              <div className="pt-4 space-y-2">
                {/* <Button variant="default" className="w-full flex gap-2">
                  <Mail className="h-4 w-4" /> Resend Verification Email
                </Button> */}
                <Button variant="ghost" asChild className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
