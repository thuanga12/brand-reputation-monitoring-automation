import React from "react";

function sentimentClass(sentiment) {
  if (sentiment === "Tích cực") return "bg-green-100 text-green-700";
  if (sentiment === "Tiêu cực") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

function crisisClass(isCrisis) {
  return isCrisis
    ? "bg-orange-100 text-orange-700"
    : "bg-slate-100 text-slate-700";
}

export default function DashboardTable({ reviews = [] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-2xl font-semibold">Đánh giá gần đây</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Thương hiệu</th>
              <th className="px-6 py-4 text-left">Người viết</th>
              <th className="px-6 py-4 text-left">Nội dung</th>
              <th className="px-6 py-4 text-left">Cảm xúc</th>
              <th className="px-6 py-4 text-left">Danh mục</th>
              <th className="px-6 py-4 text-left">Khủng hoảng</th>
              <th className="px-6 py-4 text-left">Điểm</th>
              <th className="px-6 py-4 text-left">Ngày đăng</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((row) => (
              <tr key={row._id} className="border-t border-slate-200 align-top">
                <td className="px-6 py-4 font-medium">
                  {row.title || "Highlands Coffee"}
                </td>
                <td className="px-6 py-4">{row.author || "-"}</td>
                <td className="px-6 py-4 max-w-[380px]">
                  <div className="line-clamp-3">
                    {row.review_text || "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${sentimentClass(
                      row.sentiment
                    )}`}
                  >
                    {row.sentiment || "Trung lập"}
                  </span>
                </td>
                <td className="px-6 py-4">{row.category || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${crisisClass(
                      row.is_crisis
                    )}`}
                  >
                    {row.is_crisis ? "Có" : "Không"}
                  </span>
                </td>
                <td className="px-6 py-4">{row.rating ?? "-"}</td>
                <td className="px-6 py-4 text-slate-500">
                  {row.published_at ||
                    (row.createdAt
                      ? new Date(row.createdAt).toLocaleString("vi-VN")
                      : "-")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}