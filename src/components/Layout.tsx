import { Outlet, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ClinicalAssistant from "./ui/ClinicalAssistant";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "./ui/ErrorBoundary";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900 flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Outlet key={pathname} />
          </AnimatePresence>
        </main>
        <Footer />
        <ClinicalAssistant />
        <Toaster position="top-center" richColors />
      </div>
    </ErrorBoundary>
  );
}
