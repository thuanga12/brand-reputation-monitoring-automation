import React, { useState, useMemo } from "react";
import { MapPin } from "lucide-react";

// ===== Helpers =====

/**
 * Tạo nhãn định danh duy nhất cho chi nhánh.
 * Sử dụng Title + Địa chỉ để tránh việc Highlands ở Q.1 bị gộp với Highlands Q.3
 */
function getUniqueBranchLabel(row) {
  if (!row) return "Không xác định";
  const brandName = row.title || "Thương hiệu";
  const addressShort = row.address ? row.address.split(',')[0].trim() : 'Địa chỉ lạ';
  return `${brandName} (${addressShort})`;
}

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
}

function formatDate(date) {
  if (!date) return "-";
  return typeof date === 'string' ? date : new Date(date).toLocaleString("vi-VN");
}

function sentimentStyle(sentiment) {
  const s = sentiment?.toLowerCase();
  if (s === "tích cực") return "bg-green-100 text-green-700 border-green-200";
  if (s === "tiêu cực") return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getSourceIcon(source) {
  if (source?.toLowerCase().includes("google")) return "📍";
  if (source?.toLowerCase().includes("tiktok")) return "🎵";
  return "🌐";
}

// ===== Main Component =====

export default function DashboardFeed({ reviews = [] }) {
  const [selectedBranch, setSelectedBranch] = useState("Tất cả");

  /**
   * FIX CHÍNH: Lấy danh sách chi nhánh
   * Dùng Map để đảm bảo mỗi Label (Tên + Địa chỉ) là duy nhất và không bị lọc mất dữ liệu
   */
  const branchList = useMemo(() => {
    // Tạo Set để chứa các nhãn duy nhất
    const branchSet = new Set();
    reviews.forEach(r => {
      branchSet.add(getUniqueBranchLabel(r));
    });
    
    return ["Tất cả", ...Array.from(branchSet)].sort();
  }, [reviews]);

  /**
   * Lọc danh sách reviews dựa trên chi nhánh được chọn
   */
  const filteredReviews = useMemo(() => {
    if (selectedBranch === "Tất cả") return reviews;
    return reviews.filter(r => getUniqueBranchLabel(r) === selectedBranch);
  }, [selectedBranch, reviews]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="bg-white p-5 border border-slate-200 rounded-[24px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-slate-50 rounded-xl text-[#B22830]">
            <MapPin size={20} />
          </div>
          <div className="flex-1 max-w-md">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Hệ thống chi nhánh ({branchList.length > 1 ? branchList.length - 1 : 0} địa điểm)
            </label>
            <select 
              className="bg-transparent text-slate-900 text-base font-bold outline-none cursor-pointer w-full border-b border-transparent focus:border-slate-200 transition-all"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branchList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-right border-l pl-6 border-slate-100 hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kết quả lọc</p>
          <p className="text-sm font-bold text-slate-900">{filteredReviews.length} Feedbacks</p>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((row, index) => {
            const rating = row.rating || 0;
            const ratingPercent = (rating / 5) * 100;

            return (
              <div
                key={row.review_id || `review-${index}`}
                className={`px-6 py-6 hover:bg-slate-50/50 transition-all ${
                  index !== filteredReviews.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Avatar nguồn */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl shadow-inner shrink-0">
                      {getSourceIcon(row.source)}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-base text-slate-900 leading-tight">
                        {row.title}
                      </h4>
                      <p className="text-[13px] text-blue-600 font-bold flex items-center gap-1">
                        📍 {row.address || "Địa chỉ chưa xác định"}
                      </p>

                      <div className="text-[12px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 font-medium">
                        <span className="text-slate-700 font-bold">{row.author || "Khách hàng"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-500 font-black">{rating}/5</span>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${ratingPercent}%` }} />
                          </div>
                        </div>
                        <span>•</span>
                        <span>{formatDate(row.published_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shrink-0 ${sentimentStyle(row.sentiment)}`}>
                    {row.sentiment || "Trung lập"}
                  </div>
                </div>

                {/* Nội dung Review */}
                <div className="mt-4 sm:ml-[64px] text-slate-700 text-[14px] leading-relaxed font-medium bg-slate-50/70 p-4 rounded-2xl border border-slate-50">
                  {row.review_text || "Không có nội dung đánh giá."}
                </div>

                {/* Like & Tag */}
                <div className="mt-3 sm:ml-[64px] flex items-center justify-between">
                  <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">👍 {formatNumber(row.like_count || 0)}</span>
                    {row.category && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase text-[10px] tracking-tight">
                        CHỦ ĐỀ: {row.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
            Không tìm thấy dữ liệu đánh giá
          </div>
        )}
      </div>
    </div>
  );
}