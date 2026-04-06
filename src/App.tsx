/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TreatmentsPage from "./pages/TreatmentsPage";
import AnatomyPage from "./pages/AnatomyPage";
import InvestmentPage from "./pages/InvestmentPage";
import EducationPage from "./pages/EducationPage";
import ContactPage from "./pages/ContactPage";
import UnderstandingPRP from "./pages/articles/UnderstandingPRP";
import WhartonsJellyScience from "./pages/articles/WhartonsJellyScience";
import ExosomeSignaling from "./pages/articles/ExosomeSignaling";
import ImageGenerator from "./pages/ImageGenerator";
import AdminDashboard from "./components/AdminDashboard";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/anatomy" element={<AnatomyPage />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/understanding-prp" element={<UnderstandingPRP />} />
          <Route path="/education/whartons-jelly-science" element={<WhartonsJellyScience />} />
          <Route path="/education/exosome-signaling" element={<ExosomeSignaling />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
        </Route>

        {/* Admin Route */}
        <Route path="/admin" element={
          <ErrorBoundary>
            <AdminDashboard />
            <Toaster position="top-center" richColors />
          </ErrorBoundary>
        } />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
