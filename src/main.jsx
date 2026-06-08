import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/auth-context.jsx";
import { NotificationsProvider } from "./context/notifications-context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </AuthProvider>
  </StrictMode>
);