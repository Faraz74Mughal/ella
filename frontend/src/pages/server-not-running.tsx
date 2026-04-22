import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Button } from "@/components/ui/button";

const ServerNotRunningPage = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const handleRetry = async () => {
    setIsChecking(true);
    setError("");

    try {
      // Any HTTP response means the backend is reachable, even if unauthenticated.
      await api.get("/auth/me", {
        validateStatus: () => true,
      });
      navigate("/login", { replace: true });
    } catch {
      setError("Server is still unreachable. Please make sure your backend is running and try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Connection Error</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Backend server is not running</h1>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            We could not reach the API server. Start your backend service and then retry.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={handleRetry} disabled={isChecking}>
              {isChecking ? "Checking..." : "Retry Connection"}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isChecking}
            >
              Refresh Page
            </Button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ServerNotRunningPage;
