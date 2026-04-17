import React from "react";
import { Outlet } from "react-router-dom";
import WorkflowTabs from "../components/WorkflowTabs";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4">
        <h1 className="text-xl font-bold text-[#B22830] mb-6">
          Highland Admin
        </h1>

        <nav className="space-y-3">
          <div className="font-medium text-[#B22830]">Bảng điều khiển</div>
          <div className="text-slate-600">Nhật ký AI</div>
          <div className="text-slate-600">Dữ liệu thô</div>
          <div className="text-slate-600">Thông báo</div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Quản lý Danh tiếng Thương hiệu
          </h2>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border rounded-xl text-sm">
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-[#B22830] text-white rounded-xl text-sm">
              Làm mới dữ liệu
            </button>
          </div>
        </header>

        {/* Tabs workflow */}
        <div className="bg-white border-b px-6">
          <WorkflowTabs />
        </div>

        {/* Content */}
        <main className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}