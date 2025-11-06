import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeSupabase } from "./lib/supabase-error-handler";

// Inicializar Supabase y limpiar sesiones corruptas antes de renderizar
initializeSupabase().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch((error) => {
  console.error('Failed to initialize app:', error);
  // Renderizar de todas formas para evitar pantalla en blanco
  createRoot(document.getElementById("root")!).render(<App />);
});
