import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppRouter } from "@/routes/app-router";

function App() {
 

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground antialiased">
        <AppRouter />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
