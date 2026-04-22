import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom"; // Thêm NavLink vào đây
import WorkflowTabs from "../components/WorkflowTabs";
import { User, LogOut, ChevronRight, ShieldAlert, LayoutDashboard } from "lucide-react"; // Import thêm icon cần thiết

export default function AdminLayout() {
  const navigate = useNavigate();

  // 1. Lấy thông tin user từ localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || { 
    username: "Người dùng", 
    role: "user" 
  };

  // 2. Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h1 className="text-xl font-bold text-[#B22830] mb-6">
            Highland Admin
          </h1>

          {/* HIỂN THỊ PROFILE TRÊN SIDEBAR */}
          <div className="mb-8 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B22830] rounded-full flex items-center justify-center text-white font-bold overflow-hidden border border-slate-200 shadow-sm">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                userData.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {userData.username}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                {userData.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {/* NavLink cho Bảng điều khiển để tự đổi màu khi Active */}
            <NavLink 
              to="/"
              className={({ isActive }) => 
                `flex items-center justify-between p-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-red-50 text-[#B22830] font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span>Bảng điều khiển</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </NavLink>
          </nav>
        </div>

        {/* PHẦN DƯỚI CÙNG SIDEBAR - CÀI ĐẶT & ĐĂNG XUẤT */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          {/* Chỉ hiển thị Quản lý tài khoản nếu là Admin */}
          {userData.role === 'admin' && (
            <NavLink 
              to="/users"
              className={({ isActive }) => 
                `flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all ${
                  isActive ? 'bg-red-50 text-[#B22830] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <ShieldAlert size={18} /> Quản lý tài khoản
            </NavLink>
          )}

          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 w-full p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-sm transition-colors"
          >
            <User size={18} /> Hồ sơ của tôi
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            Quản lý Danh tiếng Thương hiệu
          </h2>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-[#B22830] hover:bg-[#8e1f25] text-white rounded-xl text-sm font-medium shadow-sm transition-all active:scale-95">
              Làm mới dữ liệu
            </button>
          </div>
        </header>

        {/* Tabs workflow */}
        <div className="bg-white border-b px-6">
          <WorkflowTabs />
        </div>

        {/* Scrollable Content Area */}
        <main className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}