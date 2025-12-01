
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { AuthProvider } from "./contexts/AuthContext.tsx";
  import { Toaster } from "./components/ui/sonner.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  );
  