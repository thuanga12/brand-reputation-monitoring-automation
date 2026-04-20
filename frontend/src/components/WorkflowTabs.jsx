import React from "react";
import { NavLink } from "react-router-dom";

const WorkflowTabs = () => {
  const baseClass = "px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2";
  const activeClass = "text-[#B22830] border-[#B22830] bg-red-50 font-bold";
  const inactiveClass = "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50";

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4">
      <NavLink to="/" end className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        📊 Tổng quan
      </NavLink>

      <NavLink to="/sentiment" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        ❤️ Phân tích cảm xúc
      </NavLink>

      <NavLink to="/analysis" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        🧑‍🤝‍🧑 Theo dõi đối thủ
      </NavLink>

      <NavLink to="/interaction" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        💬 Tương tác AI
      </NavLink>
      
      <button className={`${baseClass} ${inactiveClass}`}>🗂 Quản trị</button>
      <button className={`${baseClass} ${inactiveClass}`}>📄 Báo cáo</button>
    </div>
  );
};

export default WorkflowTabs;