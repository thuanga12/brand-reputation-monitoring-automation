import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import InteractionPage from "./pages/Dashboard/InteractionPage";
import AnalysisPage from "./pages/Dashboard/AnalysisPage";
import { Toaster } from 'react-hot-toast';

const SentimentPage = lazy(() => import("./pages/Dashboard/SentimentPage"));

export default function App() {
  return (
    <BrowserRouter>
           <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div className="p-10 text-center font-bold text-slate-500 italic">Đang đồng bộ hệ thống...</div>}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/sentiment" element={<SentimentPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/interaction" element={<InteractionPage />} />
            <Route path="/ai-chat" element={<InteractionPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}