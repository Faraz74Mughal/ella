import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
import "./index.css";
import Router from "./routes/MainRoutes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import {GoogleOAuthProvider} from "@react-oauth/google"
import { GOOGLE_CLIENT_ID } from "./config";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Browser */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={client}>
      <Router />

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 5000
        }}
      />
    </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
