import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AnalysisPage from "./pages/Dashboard/AnalysisPage";
import InteractionPage from "./pages/Dashboard/InteractionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/ai-chat" element={<InteractionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}