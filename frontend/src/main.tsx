import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handlers to capture unhandled promise rejections and runtime errors
window.addEventListener('unhandledrejection', (event) => {
  // Log detailed info so we can find the origin (helps identify extension vs app issue)
  console.error('Unhandled promise rejection:', event.reason, event);
});

window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Global error:', event.message, 'at', event.filename, event.lineno + ':' + event.colno, event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
