import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { CartProvider } from "./context/CartContext.tsx";
import { ThemeProvider } from "@modular/ui"; // 🔥 استدعاء الثيم
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) throw new Error("VITE_CONVEX_URL missing");

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider> {/* 🔥 التغليف الشامل للثيم */}
      <ConvexProvider client={convex}>
        <CartProvider>
          <App />
        </CartProvider>
      </ConvexProvider>
    </ThemeProvider>
  </StrictMode>,
)