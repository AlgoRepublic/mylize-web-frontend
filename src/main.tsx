import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { store } from "./store/store.ts";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <Provider store={store} children={
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  } />
);
