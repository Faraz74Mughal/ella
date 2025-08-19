import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
import "./index.css";
import Router from "./routes/MainRoutes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Browser */}
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
  </React.StrictMode>
);
