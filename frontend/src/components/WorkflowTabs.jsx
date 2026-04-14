import React from "react";
import { NavLink } from "react-router-dom";

const WorkflowTabs = () => {
  const baseClass =
    "px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap";

  const activeClass = "text-[#B22830] border-[#B22830] bg-red-50";
  const inactiveClass =
    "text-slate-600 border-transparent hover:text-slate-900";

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        📊 Tổng quan
      </NavLink>

      <NavLink
        to="/analysis"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        ❤️ Phân tích cảm xúc
      </NavLink>

      <NavLink
        to="/interaction"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        💬 Tương tác AI
      </NavLink>

      {/* Tab chưa có route */}
      <button className={`${baseClass} ${inactiveClass}`}>
        🗂 Quản trị dữ liệu
      </button>

      <button className={`${baseClass} ${inactiveClass}`}>
        🧑‍🤝‍🧑 Theo dõi đối thủ
      </button>

      <button className={`${baseClass} ${inactiveClass}`}>
        📄 Báo cáo
      </button>
    </div>
  );
};

export default WorkflowTabs;