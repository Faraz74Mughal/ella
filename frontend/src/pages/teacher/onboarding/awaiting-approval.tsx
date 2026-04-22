import { Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AwaitingApprovalPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-yellow-500">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">Application Pending</CardTitle>
          <p className="text-muted-foreground mt-2">
            Thanks for joining, <span className="font-semibold text-foreground">{user?.name}</span>!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">Documents received successfully.</p>
            </div>
            <div className="flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">Our admin team is currently verifying your credentials.</p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground px-4">
            Typically, verification takes <span className="font-medium text-foreground">24-48 hours</span>. You will receive an email once approved.
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Refresh Status
            </Button>
            <Button
              variant="ghost"
              className="w-full text-destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}