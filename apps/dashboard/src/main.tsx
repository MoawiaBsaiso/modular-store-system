import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ThemeProvider } from "@modular/ui"; // 🔥 استدعاء مزود الثيم المركزي
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) throw new Error("VITE_CONVEX_URL missing");
if (!clerkPublishableKey) throw new Error("VITE_CLERK_PUBLISHABLE_KEY missing");

const convex = new ConvexReactClient(convexUrl);

function SafeAuthWrapper() {
  const { isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans" dir="rtl">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-sm text-slate-400">جاري تأمين الاتصال ببوابة المشرفين...</p>
      </div>
    );
  }
  
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 🔥 تغليف المنظومة بالكامل بالـ ThemeProvider */}
    <ThemeProvider>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <SafeAuthWrapper />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>,
)