/// <reference types="vite/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// تغيير الإستدعاء إلى الكائن المخصص لـ React والـ WebSockets
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("خطأ معماري: لم يتم العثور على VITE_CONVEX_URL داخل ملف الـ .env");
}

// إنشاء العميل الحي باستخدام الكائن الصحيح
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)