import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import InteractionPage from "./pages/Dashboard/InteractionPage";
import AnalysisPage from "./pages/Dashboard/AnalysisPage";

const SentimentPage = lazy(() => import("./pages/Dashboard/SentimentPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-10 text-center font-bold text-slate-500">Đang khởi tạo hệ thống...</div>}>
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