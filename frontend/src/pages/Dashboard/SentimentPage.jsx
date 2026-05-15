import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, ShieldAlert, Target, Zap, Activity, ArrowUpRight, 
  Layers, AlertCircle, RefreshCw, Sparkles, MapPin, BarChart2,
  ChevronRight, ThumbsUp, ThumbsDown, MessageSquare
} from "lucide-react";
import { getHighlandReviews, getCrmStrategy, getDailyReports } from "../../api/reviewApi"; 

const SentimentPage = () => {
  const [reviews, setReviews] = useState([]);
  const [strategy, setStrategy] = useState(null); 
  const [reports, setReports] = useState(null);   
  const [loading, setLoading] = useState(true);
  
  // State mới để quản lý danh mục đang được "Deep Dive"
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [revRes, stratRes, repRes] = await Promise.all([
        getHighlandReviews({ limit: 1000 }), 
        getCrmStrategy().catch(() => null),
        getDailyReports().catch(() => null)
      ]);
      setReviews(revRes?.items || revRes || []);
      setStrategy(Array.isArray(stratRes) ? stratRes[0] : (stratRes || null));
      setReports(Array.isArray(repRes) ? repRes[0] : (repRes || null));
    } catch (error) {
      console.error("Critical AI System Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // Tìm đoạn useMemo của detailedAnalysis và cập nhật logic reviews
const detailedAnalysis = useMemo(() => {
  if (!reviews.length) return null;

  const categoryStats = reviews.reduce((acc, r) => {
    if (!r.category) return acc;
    if (!acc[r.category]) acc[r.category] = { positive: 0, negative: 0, total: 0, badComments: [] };
    
    acc[r.category].total += 1;
    if (r.sentiment === "Tích cực") acc[r.category].positive += 1;
    if (r.sentiment === "Tiêu cực") {
      acc[r.category].negative += 1;
      // Lưu lại nội dung phàn nàn để AI bóc tách insight
      if (acc[r.category].badComments.length < 3) acc[r.category].badComments.push(r.review_text);
    }
    
    return acc;
  }, {});

  const positiveTotal = reviews.filter(r => r.sentiment === "Tích cực").length;
  const healthScore = reports?.Brand_Health ? parseInt(reports.Brand_Health) : Math.round((positiveTotal / reviews.length) * 100);

  return {
    healthScore,
    categoryStats: Object.entries(categoryStats).map(([name, stat]) => {
      const negRate = Math.round((stat.negative / stat.total) * 100);
      
      // TỰ ĐỘNG TẠO INSIGHT DỰA TRÊN DỮ LIỆU THẬT
      let dynamicInsight = `Khách hàng hài lòng với ${name.toLowerCase()}, cần duy trì phong độ hiện tại.`;
      if (negRate > 20) {
        dynamicInsight = `Phát hiện rủi ro cao về ${name.toLowerCase()}. Khách thường nhắc đến: "${stat.badComments[0]?.slice(0, 60)}..."`;
      }

      return {
        name,
        posRate: Math.round((stat.positive / stat.total) * 100),
        negRate,
        total: stat.total,
        priority: negRate > 30 ? "CRITICAL" : negRate > 15 ? "IMPROVE" : "STABLE",
        aiInsight: dynamicInsight // Gán Insight động ở đây
      };
    }).sort((a, b) => b.total - a.total),
    keywords: reports?.Hot_Keywords ? reports.Hot_Keywords.split(',') : []
  };
}, [reviews, reports]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-black text-slate-400 tracking-tighter">
      <RefreshCw className="animate-spin mr-3 text-[#B22830]" size={32} /> LOADING AI INTELLIGENCE...
    </div>
  );

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER COMMAND CENTER */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Sparkles className="text-[#B22830]" /> AI Command <span className="text-[#B22830]">Center</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
             <MapPin size={14}/> {strategy?.branch_name || "Highlands Coffee"} | {strategy?.report_month}
          </p>
        </div>
        <button onClick={fetchAllData} className="p-4 bg-white border rounded-2xl hover:bg-slate-50 transition-all shadow-sm"><RefreshCw size={20} /></button>
      </div>

      {/* --- PHẦN 1: DETAILED SENTIMENT INTELLIGENCE --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <BarChart2 className="text-[#B22830]" /> Deep-Dive Intelligence
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Click vào danh mục để phân tích sâu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {detailedAnalysis?.categoryStats.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={`group cursor-pointer space-y-4 p-8 rounded-[32px] border transition-all duration-300 ${
                activeCategory === cat.name 
                ? "bg-slate-900 border-slate-900 shadow-2xl scale-[1.02]" 
                : "bg-white border-slate-100 hover:border-[#B22830]/30 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${activeCategory === cat.name ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
                   <MessageSquare size={18} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded ${
                  cat.priority === "CRITICAL" ? "bg-red-500 text-white" : 
                  cat.priority === "IMPROVE" ? "bg-amber-400 text-white" : "bg-emerald-500 text-white"
                }`}>
                  {cat.priority}
                </span>
              </div>

              <div>
                <span className={`font-black uppercase text-xs tracking-wider ${activeCategory === cat.name ? "text-white" : "text-slate-800"}`}>
                  {cat.name}
                </span>
                <p className={`text-[10px] font-bold ${activeCategory === cat.name ? "text-slate-400" : "text-slate-400"}`}>
                  {cat.total} Đánh giá tháng này
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-slate-200/20 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-400" style={{ width: `${cat.posRate}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${cat.negRate}%` }}></div>
                </div>
                <div className={`flex justify-between text-[10px] font-black ${activeCategory === cat.name ? "text-slate-300" : "text-slate-500"}`}>
                  <span className="flex items-center gap-1"><ThumbsUp size={10} /> {cat.posRate}%</span>
                  <span className="flex items-center gap-1"><ThumbsDown size={10} /> {cat.negRate}%</span>
                </div>
              </div>

              {/* Mở rộng chi tiết khi được chọn */}
              {/* Tìm đoạn hiển thị Insight nhanh trong phần return và sửa lại như sau: */}
{activeCategory === cat.name && (
  <div className="pt-4 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2 text-left">
    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1">
      <Sparkles size={12}/> AI Insight thực tế
    </p>
    <p className={`text-xs leading-relaxed font-medium ${activeCategory === cat.name ? "text-slate-200" : "text-slate-600"}`}>
      {/* KHÔNG CÒN BỊ TRÙNG LẶP VÌ GỌI DỮ LIỆU ĐỘNG */}
      {cat.aiInsight}
    </p>
    <div className="flex gap-2">
      <button className="flex-1 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-yellow-400 transition-colors">
        Tạo báo cáo chi tiết
      </button>
      <button className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
        <ChevronRight size={14} />
      </button>
    </div>
  </div>
)}
            </div>
          ))}
        </div>
      </section>

      {/* --- PHẦN 2: KPI & CHURN (Giữ nguyên phong cách Dashboard cao cấp) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Layers size={16} /> Brand Health Dashboard
              </h3>
              <div className="flex items-baseline gap-4">
                <span className="text-[140px] font-black leading-none tracking-tighter">{detailedAnalysis?.healthScore}</span>
                <span className="text-2xl font-bold text-emerald-400">{reports?.SOV || "75%"} SOV</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detailedAnalysis?.keywords.map((kw, i) => (
                  <span key={i} className="px-4 py-2 bg-white/10 rounded-2xl text-[11px] font-bold border border-white/10 hover:bg-white/20 transition-all cursor-default">
                    #{kw.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end space-y-8 border-l border-white/10 pl-12">
              <div className="space-y-3">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Painpoint chính</p>
                <p className="text-2xl font-bold text-yellow-400 leading-tight italic">"{strategy?.churn_reason}"</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Target Segment</p>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">{strategy?.customer_segment}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[56px] p-12 border shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all">
          <div>
            <h3 className="font-black text-xl text-slate-800 mb-10 flex items-center gap-2"><ShieldAlert className="text-red-500" /> Churn Radar</h3>
            <div className="p-10 bg-red-50 rounded-[44px] border border-red-100 text-center">
              <p className="text-red-600 font-black text-[10px] uppercase mb-2 tracking-widest">Tỷ lệ rủi ro dự báo</p>
              <p className="text-7xl font-black text-red-900">{strategy?.churn_risk_rate}</p>
            </div>
          </div>
          <button className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xs tracking-widest uppercase mt-8 hover:bg-[#B22830] transition-colors">
            XỬ LÝ KHỦNG HOẢNG
          </button>
        </div>
      </div>

      {/* --- PHẦN 3: AI ACTIONABLE STRATEGY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[56px] p-12 border shadow-xl relative overflow-hidden">
          <Zap className="absolute top-12 right-12 text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
          <h3 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-3"><Target className="text-[#B22830]" /> AI Strategic Advice</h3>
          <div className="space-y-10">
            <div className="group">
              <p className="text-blue-900 font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
                <ThumbsUp size={14} /> Giữ chân (Retention)
              </p>
              <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-50 group-hover:bg-blue-50 transition-colors">
                <p className="text-slate-700 font-bold leading-relaxed">{strategy?.retention_action}</p>
              </div>
            </div>
            <div className="group">
              <p className="text-red-900 font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
                <ThumbsDown size={14} /> Phục hồi (Recovery)
              </p>
              <div className="bg-red-50/50 p-6 rounded-[32px] border border-red-100 group-hover:bg-red-50 transition-colors">
                <p className="text-slate-700 font-bold leading-relaxed">{strategy?.recovery_action}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#B22830] rounded-[56px] p-12 text-white shadow-2xl flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-all duration-700"></div>
          
          <div className="space-y-10 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tight">Loyalty Hook</h3>
              <Activity className="opacity-50" />
            </div>
            <p className="text-red-100 text-lg font-medium italic bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-inner leading-relaxed">
              "{strategy?.loyalty_hook}"
            </p>
            <div className="pt-10 border-t border-white/10 space-y-4">
               <p className="text-[10px] font-black text-red-200 uppercase tracking-[0.2em]">Trend Forecast</p>
               <p className="text-sm font-medium leading-relaxed text-red-50">{reports?.Trend_Forecast}</p>
            </div>
          </div>
          <button className="mt-12 w-full py-7 bg-white text-[#B22830] rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
             KÍCH HOẠT CHIẾN DỊCH AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentimentPage;