import React from "react";

export default function DashboardStats({ stats }) {
  const cards = [
    {
      title: "Tổng đánh giá",
      value: stats?.totalReviews ?? 0,
      sub: "Số review đang hiển thị",
    },
    {
      title: "Tỷ lệ tích cực",
      value: `${stats?.positiveRate ?? 0}%`,
      sub: `${stats?.positiveCount ?? 0} review tích cực`,
    },
    {
      title: "Điểm đánh giá TB",
      value: stats?.avgRating ?? 0,
      sub: "Trung bình số sao",
    },
    {
      title: "Cảnh báo khủng hoảng",
      value: stats?.crisisCount ?? 0,
      sub: "Review cần ưu tiên xử lý",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {cards.map((item) => (
        <div
          key={item.title}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 mb-4" />
          <p className="text-slate-600 mb-2">{item.title}</p>
          <h3 className="text-4xl font-bold text-slate-900">{item.value}</h3>
          <p className="text-sm text-slate-500 mt-2">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}