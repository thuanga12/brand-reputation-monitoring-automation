import React from "react";
import { MessageSquare, ThumbsUp, Star, AlertTriangle } from "lucide-react";

const formatNumber = (num) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export default function DashboardStats({ stats }) {
  const cards = [
    {
      title: "Tổng đánh giá",
      value: formatNumber(stats?.totalReviews ?? 0),
      sub: "Google Maps",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Tỷ lệ tích cực",
      value: `${stats?.positiveRate ?? 0}%`,
      sub: `${formatNumber(stats?.positiveCount ?? 0)} hài lòng`,
      icon: ThumbsUp,
      color: "green",
    },
    {
      title: "Điểm trung bình",
      value: stats?.avgRating ?? 0,
      sub: "Rating trung bình",
      icon: Star,
      color: "yellow",
    },
    {
      title: "Cảnh báo",
      value: stats?.crisisCount ?? 0,
      sub: stats?.crisisCount > 0 ? "Cần xử lý ngay" : "Ổn định",
      icon: AlertTriangle,
      color: stats?.crisisCount > 0 ? "red" : "slate",
      isAlert: stats?.crisisCount > 0,
    },
  ];

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-400 to-yellow-500",
    red: "from-red-500 to-red-600",
    slate: "from-slate-400 to-slate-500",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {cards.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className={`
              relative group rounded-2xl p-[1px] 
              bg-gradient-to-br ${colorMap[item.color]} 
              hover:scale-[1.02] transition-all duration-300
            `}
          >
            <div className="bg-white rounded-2xl p-6 h-full shadow-sm group-hover:shadow-lg transition-all">
              
              {/* ALERT BADGE */}
              {item.isAlert && (
                <span className="absolute top-3 right-3 text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                  ALERT
                </span>
              )}

              {/* ICON */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  bg-gradient-to-br ${colorMap[item.color]} text-white shadow-md
                `}
              >
                <Icon size={22} />
              </div>

              {/* TITLE */}
              <p className="text-slate-500 text-sm font-medium">
                {item.title}
              </p>

              {/* VALUE */}
              <h3
                className={`
                  text-3xl font-bold mt-1
                  ${item.isAlert ? "text-red-600" : "text-slate-900"}
                `}
              >
                {item.value}
              </h3>

              {/* SUB */}
              <p className="text-xs text-slate-400 mt-2">
                {item.sub}
              </p>

              {/* HOVER LINE */}
              <div
                className={`
                  absolute bottom-0 left-0 h-1 w-0 group-hover:w-full
                  bg-gradient-to-r ${colorMap[item.color]}
                  transition-all duration-300 rounded-b-2xl
                `}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}