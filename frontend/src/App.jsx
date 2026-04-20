import React, { Suspense, lazy } from "react"; // Dùng Lazy load để chống sập trang chủ
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import InteractionPage from "./pages/Dashboard/InteractionPage";
import AnalysisPage from "./pages/Dashboard/AnalysisPage";

// Dùng lazy để nếu file này lỗi thì không kéo theo cả App sập
const SentimentPage = lazy(() => import("./pages/Dashboard/SentimentPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-10 text-center">Đang tải ứng dụng...</div>}>
        <Routes>
          <Route element={<AdminLayout />}>
            {/* Trang chủ - Luôn ưu tiên chạy */}
            <Route path="/" element={<DashboardPage />} />
            
            {/* Nhiệm vụ 1: Phân tích cảm xúc */}
            <Route path="/sentiment" element={<SentimentPage />} />
            
            {/* Nhiệm vụ 2: Theo dõi đối thủ */}
            <Route path="/analysis" element={<AnalysisPage />} />
            
            <Route path="/interaction" element={<InteractionPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}