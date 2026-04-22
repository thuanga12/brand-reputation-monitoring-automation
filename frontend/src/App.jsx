import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import InteractionPage from "./pages/Dashboard/InteractionPage";
import AnalysisPage from "./pages/Dashboard/AnalysisPage";
import Login from "./pages/Dashboard/Login"; 
import Register from "./pages/Dashboard/Register";
import { Toaster } from 'react-hot-toast';
import ProfilePage from "./pages/Dashboard/ProfilePage";

// --- THÊM DÒNG NÀY ---
import UserManagement from "./pages/Dashboard/UserManagement"; 
// ----------------------

const SentimentPage = lazy(() => import("./pages/Dashboard/SentimentPage"));

/**
 * Component bảo vệ Route nâng cấp
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div className="p-10 text-center font-bold text-slate-500 italic">Đang đồng bộ hệ thống...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            
            {/* Mọi role đã login đều vào được */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sentiment" element={<SentimentPage />} />

            {/* Chỉ Admin mới vào được Quản lý tài khoản */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            {/* Admin và Manager */}
            <Route path="/analysis" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AnalysisPage />
              </ProtectedRoute>
            } />

            <Route path="/interaction" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <InteractionPage />
              </ProtectedRoute>
            } />

            {/* Chỉ Admin mới vào được AI Chat */}
            <Route path="/ai-chat" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InteractionPage />
              </ProtectedRoute>
            } />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}