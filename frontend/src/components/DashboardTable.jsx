import React, { useMemo } from "react";
import { MapPin } from "lucide-react";

// ===== Helpers (Đồng bộ từ cả 2 bản) =====

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

// Lấy icon nguồn (Google/TikTok/Web)
function getSourceIcon(source) {
  if (source?.toLowerCase().includes("google")) return "📍";
  if (source?.toLowerCase().includes("tiktok")) return "🎵";
  return "🌐";
}

// ===== Main Component =====

export default function DashboardTable({ reviews = [], allData = [], currentBranch = "", onBranchChange }) {
  
  // 1. Lấy danh sách địa chỉ đầy đủ từ allData để hiện dropdown (Logic server-side)
  const branchList = useMemo(() => {
    const sourceData = allData.length > 0 ? allData : reviews;
    const addressSet = new Set(sourceData.map(r => r.address).filter(Boolean));
    return ["Tất cả", ...Array.from(addressSet)].sort();
  }, [allData, reviews]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR - GIỮ GIAO DIỆN CỦA CODE DƯỚI */}
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
              value={currentBranch || "Tất cả"}
              onChange={(e) => onBranchChange(e.target.value === "Tất cả" ? "" : e.target.value)}
            >
              {branchList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-right border-l pl-6 border-slate-100 hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kết quả lọc</p>
          <p className="text-sm font-bold text-slate-900">{reviews.length} Feedbacks</p>
        </div>
      </div>

      {/* FEED LIST - HIỂN THỊ TRỰC TIẾP REVIEWS TỪ CHA */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        {reviews.length > 0 ? (
          reviews.map((row, index) => {
            const ratingPercent = ((row.rating || 0) / 5) * 100;
            return (
              <div key={index} className={`px-6 py-6 hover:bg-slate-50/50 transition-all ${index !== reviews.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Sử dụng getSourceIcon để phân biệt nguồn dữ liệu */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl shrink-0 font-black shadow-inner">
                      {getSourceIcon(row.source)}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-black text-base text-slate-900 leading-tight">{row.title}</h4>
                      <p className="text-[13px] text-blue-600 font-bold flex items-center gap-1">📍 {row.address}</p>
                      
                      <div className="text-[12px] text-slate-400 flex flex-wrap items-center gap-x-3 mt-2 font-medium">
                        <span className="text-slate-700 font-bold">{row.author}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-500 font-black">{row.rating}/5</span>
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

                <div className="mt-4 sm:ml-[64px] text-slate-700 text-[14px] leading-relaxed font-medium bg-slate-50/70 p-4 rounded-2xl border border-slate-100 italic">
                  "{row.review_text || "Không có nội dung đánh giá."}"
                </div>

                {/* Bổ sung hiển thị Like và Category nếu có từ bản code 1 */}
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
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">
            Hệ thống không tìm thấy dữ liệu cho chi nhánh này
          </div>
        )}
      </div>
    </div>
  );
}