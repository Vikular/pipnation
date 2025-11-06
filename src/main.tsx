
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  console.log("🚀 main.tsx executing...");
  console.log("📦 Environment variables:", {
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

  const root = document.getElementById("root");
  if (!root) {
    console.error("❌ Root element not found!");
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
  } else {
    console.log("✅ Root element found, mounting React app...");
    try {
      createRoot(root).render(<App />);
      console.log("✅ React app mounted successfully");
    } catch (error) {
      console.error("❌ Error mounting React app:", error);
      root.innerHTML = `<div style="padding: 20px; color: red;">
        <h1>Error Loading App</h1>
        <pre>${error}</pre>
      </div>`;
    }
  }
  