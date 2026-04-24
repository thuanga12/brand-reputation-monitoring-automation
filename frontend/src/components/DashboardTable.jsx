import React, { useMemo } from "react";
import { MapPin } from "lucide-react";

// ================= Helpers (Tổng hợp đầy đủ) =================

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
}

function formatDate(date) {
  if (!date) return "Vừa cập nhật";
  return typeof date === 'string' ? date : new Date(date).toLocaleDateString("vi-VN");
}

function sentimentStyle(sentiment) {
  const s = (sentiment || "").toString().toLowerCase().trim();
  if (s === "tích cực" || s === "positive") 
    return "bg-green-100 text-green-700 border-green-200";
  if (s === "tiêu cực" || s === "negative") 
    return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

// Hàm này cực kỳ quan trọng để không bị trắng màn hình
function getSourceIcon(source) {
  const s = (source || "").toLowerCase();
  if (s.includes("google")) return "📍";
  if (s.includes("tiktok")) return "🎵";
  if (s.includes("facebook")) return "👥";
  return "🌐";
}

// ================= Main Component =================

export default function DashboardTable({ reviews = [], allData = [], currentBranch = "", onBranchChange }) {
  
  // 1. Chuẩn hóa danh sách chi nhánh
  const branchList = useMemo(() => {
    const sourceData = allData.length > 0 ? allData : reviews;
    const addressSet = new Set(
      sourceData
        .map(r => (r.address || "").trim())
        .filter(Boolean)
    );
    return ["Tất cả", ...Array.from(addressSet)].sort();
  }, [allData, reviews]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="bg-white p-5 border border-slate-200 rounded-[24px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-3 bg-[#B22830]/5 rounded-2xl text-[#B22830]">
            <MapPin size={24} />
          </div>
          <div className="flex-1 max-w-md">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
              Hệ thống chi nhánh ({branchList.length > 1 ? branchList.length - 1 : 0} địa điểm)
            </label>
            <select 
              className="bg-transparent text-slate-900 text-lg font-bold outline-none cursor-pointer w-full"
              value={currentBranch || "Tất cả"}
              onChange={(e) => onBranchChange(e.target.value === "Tất cả" ? "" : e.target.value)}
            >
              {branchList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-right border-l pl-8 border-slate-100 hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dữ liệu hiển thị</p>
          <p className="text-xl font-black text-slate-900">{reviews.length} <span className="text-sm font-medium text-slate-400">Feedbacks</span></p>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        {reviews.length > 0 ? (
          reviews.map((row, index) => {
            const ratingPercent = ((Number(row.rating) || 0) / 5) * 100;
            const sentimentRaw = (row.sentiment || "Trung lập").toString().trim();
            const sentimentDisplay = sentimentRaw.charAt(0).toUpperCase() + sentimentRaw.slice(1);

            return (
              <div key={row.review_id || index} className={`px-8 py-8 hover:bg-slate-50/50 transition-all ${index !== reviews.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shrink-0 shadow-lg">
                      {getSourceIcon(row.source)}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-slate-900 tracking-tight">{row.title}</h4>
                      <p className="text-sm text-blue-600 font-semibold flex items-center gap-1.5">
                        <MapPin size={14} /> {row.address}
                      </p>
                      
                      <div className="text-[13px] text-slate-400 flex flex-wrap items-center gap-x-4 mt-3">
                        <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded-md">{row.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 font-black">{row.rating}/5</span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${ratingPercent}%` }} />
                          </div>
                        </div>
                        <span className="font-medium">{formatDate(row.published_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-sm ${sentimentStyle(row.sentiment)}`}>
                    {sentimentDisplay}
                  </div>
                </div>

                <div className="mt-5 sm:ml-[76px] text-slate-700 text-[15px] leading-relaxed font-medium bg-slate-50/80 p-5 rounded-3xl border border-slate-100 relative">
                  <span className="absolute -top-3 left-6 bg-white px-2 text-slate-300 text-2xl italic font-serif leading-none">“</span>
                  {row.review_text || "Khách hàng không để lại nội dung."}
                </div>

                <div className="mt-4 sm:ml-[76px] flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                      👍 {formatNumber(row.like_count)}
                    </span>
                    {row.category && (
                      <span className="bg-[#B22830]/5 text-[#B22830] px-4 py-1 rounded-full font-black text-[9px] tracking-tighter border border-[#B22830]/10">
                        # {row.category.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {row.is_crisis && (
                    <span className="text-[10px] font-black text-red-500 animate-pulse flex items-center gap-1">
                      ⚠️ CẢNH BÁO KHỦNG HOẢNG
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">
              Không tìm thấy dữ liệu chi nhánh
            </div>
          </div>
        )}
      </div>
    </div>
  );
}