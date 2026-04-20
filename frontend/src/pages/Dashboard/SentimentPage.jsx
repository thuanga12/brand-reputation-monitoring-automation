import React, { useState, useEffect, useMemo } from 'react';
import { getHighlandReviews } from "../../api/reviewApi"; 
import DashboardTable from "../../components/DashboardTable";
import { Search, Download, RefreshCcw, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";

const SentimentPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHighlandReviews({ limit: 1000 });
      // Kiểm tra cấu trúc dữ liệu trả về từ API của bạn
      const data = res?.items || res || [];
      setReviews(data);
    } catch (error) {
      console.error("Lỗi gọi dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // LOGIC LỌC AN TOÀN
  const filteredReviews = useMemo(() => {
    return reviews.filter(item => {
      // 1. Tìm kiếm (Không phân biệt hoa thường)
      const content = (item.content || "").toLowerCase();
      const author = (item.author_name || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchesSearch = content.includes(search) || author.includes(search);
      
      // 2. Lọc cảm xúc (Chấp nhận cả tiếng Anh lẫn tiếng Việt)
      if (sentimentFilter === "All") return matchesSearch;
      
      const itemSentiment = (item.sentiment || "").toLowerCase();
      const filterValue = sentimentFilter.toLowerCase();
      
      // Khớp "tích cực" hoặc "positive", "tiêu cực" hoặc "negative"
      const matchesSentiment = itemSentiment.includes(filterValue) || 
                               (filterValue === "tích cực" && itemSentiment === "positive") ||
                               (filterValue === "tiêu cực" && itemSentiment === "negative");

      return matchesSearch && matchesSentiment;
    });
  }, [reviews, searchTerm, sentimentFilter]);

  const stats = {
    total: filteredReviews.length,
    positive: filteredReviews.filter(r => (r.sentiment || "").toLowerCase().includes("tích cực") || (r.sentiment || "").toLowerCase() === "positive").length,
    negative: filteredReviews.filter(r => (r.sentiment || "").toLowerCase().includes("tiêu cực") || (r.sentiment || "").toLowerCase() === "negative").length,
    crisis: filteredReviews.filter(r => r.is_crisis).length
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-3 bg-[#B22830] text-white rounded-2xl shadow-lg shadow-red-200">
              <TrendingUp size={28} />
            </span>
            Phân tích cảm xúc <span className="text-[#B22830]">AI</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Tìm thấy {filteredReviews.length} dữ liệu phù hợp.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 shadow-sm transition-all">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Đang hiển thị" value={stats.total} icon={<MessageSquare color="#64748b" />} color="bg-blue-500" />
        <StatCard title="Tích cực" value={stats.positive} icon={<CheckCircle2 color="#10b981" />} color="bg-emerald-500" />
        <StatCard title="Tiêu cực" value={stats.negative} icon={<AlertTriangle color="#f59e0b" />} color="bg-amber-500" />
        <StatCard title="Rủi ro" value={stats.crisis} icon={<AlertTriangle color="#ef4444" />} color="bg-red-500" isCrisis={true} />
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#B22830]/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {["All", "Tích cực", "Tiêu cực"].map((type) => (
            <button
              key={type}
              onClick={() => setSentimentFilter(type)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                sentimentFilter === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {type === "All" ? "Tất cả" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#B22830] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold">ĐANG TẢI DỮ LIỆU...</p>
          </div>
        ) : (
          <div className="p-2 overflow-x-auto">
            <DashboardTable reviews={filteredReviews} />
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isCrisis }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">{title}</p>
        <h4 className={`text-3xl font-black ${isCrisis && value > 0 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
          {value.toLocaleString()}
        </h4>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    </div>
  </div>
);

export default SentimentPage;