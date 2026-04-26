import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, ShieldAlert, Target, Zap, Activity, ArrowUpRight, 
  Layers, AlertCircle, RefreshCw, Sparkles, MapPin, BarChart2,
  ChevronRight, ThumbsUp, ThumbsDown, MessageSquare, X, Calendar
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { getHighlandReviews, getCrmStrategy, getDailyReports } from "../../api/reviewApi"; 

// --- COMPONENT TOOLTIP TÁCH RIÊNG ĐỂ TRÁNH RERENDER ---
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-black/5">
      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex justify-between gap-8 text-sm font-bold items-center mb-1">
          <span className="flex items-center gap-2" style={{ color: entry.color }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="text-slate-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

const SentimentPage = () => {
  const [reviews, setReviews] = useState([]);
  const [strategy, setStrategy] = useState(null); 
  const [reports, setReports] = useState(null);   
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

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

  // --- LOGIC XỬ LÝ DỮ LIỆU BIỂU ĐỒ ---
  const trendData = useMemo(() => {
    if (!reviews.length) return [];

    const parseAnyDate = (dateStr) => {
      const now = new Date();
      const s = (dateStr || "").toLowerCase().trim();
      if (s.includes('ago')) {
        const number = parseInt(s.match(/\d+/)?.[0] || 0);
        const d = new Date();
        if (s.includes('hour')) d.setHours(now.getHours() - number);
        else if (s.includes('day')) d.setDate(now.getDate() - number);
        else if (s.includes('week')) d.setDate(now.getDate() - (number * 7));
        else if (s.includes('month')) d.setMonth(now.getMonth() - number);
        return d;
      }
      const vnDateMatch = s.match(/(\d+)\s+thg\s+(\d+),\s+(\d+)/);
      if (vnDateMatch) {
        return new Date(parseInt(vnDateMatch[3]), parseInt(vnDateMatch[2]) - 1, parseInt(vnDateMatch[1]));
      }
      return new Date(dateStr);
    };

    const dailyMap = reviews.reduce((acc, r) => {
      const fullDateObj = parseAnyDate(r.published_at);
      if (isNaN(fullDateObj.getTime())) return acc;
      const dateKey = fullDateObj.toISOString().split('T')[0]; 
      const displayDate = `${fullDateObj.getDate()}/${fullDateObj.getMonth() + 1}`;

      if (!acc[dateKey]) {
        acc[dateKey] = { dateKey, displayDate, positive: 0, negative: 0, total: 0, rawDate: fullDateObj };
      }
      acc[dateKey].total += 1;
      const s = (r.sentiment || "").toLowerCase().trim();
      if (s === "tích cực" || s === "positive") acc[dateKey].positive += 1;
      if (s === "tiêu cực" || s === "negative") acc[dateKey].negative += 1;
      return acc;
    }, {});

    return Object.values(dailyMap)
      .sort((a, b) => a.rawDate - b.rawDate)
      .map(item => ({
        name: item.displayDate,
        'Tích cực': Math.round((item.positive / item.total) * 100),
        'Tiêu cực': Math.round((item.negative / item.total) * 100),
      }));
  }, [reviews]);

  // --- PHÂN TÍCH CATEGORY ---
  const detailedAnalysis = useMemo(() => {
    if (!reviews.length) return null;

    const categoryStats = reviews.reduce((acc, r) => {
      const catName = (r.category || "Khác").toString().trim();
      const s = (r.sentiment || "").toString().toLowerCase().trim();
      if (!acc[catName]) acc[catName] = { positive: 0, negative: 0, total: 0, badComments: [] };
      acc[catName].total += 1;
      if (s === "tích cực" || s === "positive") acc[catName].positive += 1;
      if (s === "tiêu cực" || s === "negative") {
        acc[catName].negative += 1;
        if (acc[catName].badComments.length < 3 && r.review_text) acc[catName].badComments.push(r.review_text);
      }
      return acc;
    }, {});

    const positiveTotal = reviews.filter(r => {
        const s = (r.sentiment || "").toLowerCase();
        return s === "tích cực" || s === "positive";
    }).length;

    const healthScore = reports?.Brand_Health ? parseInt(reports.Brand_Health) : Math.round((positiveTotal / reviews.length) * 100);

    return {
      healthScore,
      categoryStats: Object.entries(categoryStats).map(([name, stat]) => {
        const negRate = Math.round((stat.negative / stat.total) * 100);
        const posRate = Math.round((stat.positive / stat.total) * 100);
        let dynamicInsight = `Khách hàng hài lòng với ${name.toLowerCase()}.`;
        if (negRate > 20) dynamicInsight = `Rủi ro tại ${name.toLowerCase()}: "${stat.badComments[0]?.slice(0, 40)}..."`;
        return {
          name, posRate, negRate, total: stat.total,
          priority: negRate > 30 ? "CRITICAL" : negRate > 15 ? "IMPROVE" : "STABLE",
          aiInsight: dynamicInsight,
          badComments: stat.badComments
        };
      }).sort((a, b) => b.total - a.total),
      keywords: reports?.Hot_Keywords ? reports.Hot_Keywords.split(',') : []
    };
  }, [reviews, reports]);

  const handleShowDetail = (categoryName) => {
    const catStats = detailedAnalysis.categoryStats.find(c => c.name === categoryName);
    setSelectedDetail({
      name: categoryName,
      stats: catStats,
      aiStrategy: strategy?.retention_action || "Duy trì tiêu chuẩn phục vụ.",
      riskAnalysis: strategy?.churn_reason || "Chưa phát hiện rủi ro.",
      recovery: strategy?.recovery_action || "Chủ động phản hồi khách hàng."
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-black text-slate-400 tracking-tighter">
      <RefreshCw className="animate-spin mr-3 text-[#B22830]" size={32} /> LOADING AI INTELLIGENCE...
    </div>
  );

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen space-y-10 animate-in fade-in duration-700 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Sparkles className="text-[#B22830]" /> AI Command <span className="text-[#B22830]">Center</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
             <MapPin size={14} className="text-[#B22830]"/> {strategy?.branch_name || "Hệ thống Highlands"}
          </p>
        </div>
        <button onClick={fetchAllData} className="p-4 bg-white border border-slate-200 rounded-2xl hover:rotate-180 transition-all duration-500 shadow-sm">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* BIỂU ĐỒ ĐƯỜNG - SENTIMENT VELOCITY (FIXED) */}
      <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <TrendingUp className="text-[#B22830]" /> Sentiment Velocity
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Biến động cảm xúc qua dòng thời gian</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Tích cực (%)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-black text-red-700 uppercase tracking-tighter">Tiêu cực (%)</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Gradient cho Fill (Vùng màu) */}
                <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>

                {/* Gradient cho Stroke (Đường viền) */}
                <linearGradient id="posStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="negStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>

                <filter id="glow" height="300%">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                minTickGap={40}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#B22830', strokeWidth: 1 }} />
              
              <Area 
                type="monotone"
                dataKey="Tích cực"
                stroke="url(#posStroke)"
                strokeWidth={2} // Giảm độ dày xuống còn 2 để đường mảnh và sắc nét
                fillOpacity={1}
                fill="url(#colorPos)"
                filter="url(#glow)"
                // Làm nhỏ các chấm dữ liệu (dot)
                dot={{ r: 2, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }} 
                activeDot={{ r: 4, strokeWidth: 0 }}
              />

              <Area 
                type="monotone"
                dataKey="Tiêu cực"
                stroke="url(#negStroke)"
                strokeWidth={2} // Đồng nhất độ dày mảnh
                fillOpacity={1}
                fill="url(#colorNeg)"
                dot={{ r: 2, fill: '#ef4444', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY INTELLIGENCE */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 px-2">
            <BarChart2 className="text-[#B22830]" /> Category Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {detailedAnalysis?.categoryStats.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={`group cursor-pointer space-y-4 p-8 rounded-[32px] border transition-all duration-500 ${
                activeCategory === cat.name ? "bg-slate-900 border-slate-900 shadow-2xl scale-[1.02]" : "bg-white border-slate-100 hover:border-[#B22830]/30 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${activeCategory === cat.name ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}><MessageSquare size={18} /></div>
                <span className={`text-[10px] font-black px-2 py-1 rounded ${cat.priority === "CRITICAL" ? "bg-red-500 text-white" : cat.priority === "IMPROVE" ? "bg-amber-400 text-white" : "bg-emerald-500 text-white"}`}>{cat.priority}</span>
              </div>
              <div>
                <span className={`font-black uppercase text-xs tracking-wider ${activeCategory === cat.name ? "text-white" : "text-slate-800"}`}>{cat.name}</span>
                <p className="text-[10px] font-bold text-slate-400">{cat.total} Feedbacks</p>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-400" style={{ width: `${cat.posRate}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${cat.negRate}%` }}></div>
                </div>
                <div className={`flex justify-between text-[10px] font-black ${activeCategory === cat.name ? "text-slate-300" : "text-slate-500"}`}>
                  <span>👍 {cat.posRate}%</span><span>👎 {cat.negRate}%</span>
                </div>
              </div>
              {activeCategory === cat.name && (
                <div className="pt-4 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2">
                  <p className="text-xs leading-relaxed font-medium text-slate-200 italic">"{cat.aiInsight}"</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleShowDetail(cat.name); }}
                    className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-[#B22830] hover:text-white transition-colors"
                  >
                    Phân tích chi tiết với AI
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BRAND HEALTH & RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B22830]/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Layers size={16} /> Brand Health Score</h3>
              <div className="flex items-baseline gap-4">
                <span className="text-[120px] font-black leading-none tracking-tighter">{detailedAnalysis?.healthScore}</span>
                <span className="text-2xl font-bold text-emerald-400">/ 100</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detailedAnalysis?.keywords.map((kw, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 rounded-2xl text-[11px] font-bold border border-white/10 hover:bg-white/20 transition-all cursor-default">#{kw.trim()}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end space-y-8 md:border-l border-white/10 md:pl-12">
              <div className="space-y-3">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Dự báo rủi ro</p>
                <p className="text-2xl font-bold text-yellow-400 leading-tight italic">"{strategy?.churn_reason || "Hệ thống ổn định"}"</p>
              </div>
              <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Target Segment</p>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">{strategy?.customer_segment}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[56px] p-12 border border-slate-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
          <div>
            <h3 className="font-black text-xl text-slate-800 mb-10 flex items-center gap-2"><ShieldAlert className="text-red-500" /> Churn Radar</h3>
            <div className="p-10 bg-red-50 rounded-[44px] border border-red-100 text-center">
              <p className="text-red-600 font-black text-[10px] uppercase mb-2 tracking-widest">Churn Risk Rate</p>
              <p className="text-7xl font-black text-red-900">{strategy?.churn_risk_rate || "0%"}</p>
            </div>
          </div>
          <button className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase mt-8 hover:bg-[#B22830] transition-all">XỬ LÝ KHỦNG HOẢNG</button>
        </div>
      </div>

      {/* STRATEGY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white rounded-[56px] p-12 border border-slate-100 shadow-xl relative">
          <Zap className="absolute top-12 right-12 text-yellow-400 fill-yellow-400 animate-bounce" size={32} />
          <h3 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-3"><Target className="text-[#B22830]" /> AI Action Plan</h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-emerald-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><ThumbsUp size={14} /> Chiến lược Giữ chân</p>
              <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100">
                <p className="text-slate-700 text-sm font-bold leading-relaxed">{strategy?.retention_action}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-red-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><ThumbsDown size={14} /> Chiến lược Phục hồi</p>
              <div className="bg-red-50/50 p-6 rounded-[32px] border border-red-100">
                <p className="text-slate-700 text-sm font-bold leading-relaxed">{strategy?.recovery_action}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#B22830] rounded-[56px] p-12 text-white shadow-2xl flex flex-col justify-between relative group overflow-hidden">
          <div className="space-y-10 relative z-10">
            <div className="flex items-center justify-between"><h3 className="text-3xl font-black tracking-tight">Loyalty Hook</h3><Activity className="opacity-50 animate-pulse" /></div>
            <p className="text-red-50 text-xl font-bold italic bg-white/10 p-8 rounded-[40px] border border-white/10 shadow-inner leading-relaxed">"{strategy?.loyalty_hook}"</p>
            <div className="pt-10 border-t border-white/20 space-y-4">
               <p className="text-[10px] font-black text-red-200 uppercase tracking-[0.2em]">Trend Forecast</p>
               <p className="text-sm font-medium leading-relaxed text-red-50 italic">{reports?.Trend_Forecast}</p>
            </div>
          </div>
          <button className="mt-12 w-full py-7 bg-white text-[#B22830] rounded-[28px] font-black text-xs uppercase shadow-2xl transition-all">KÍCH HOẠT CHIẾN DỊCH AI</button>
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[48px] p-10 shadow-2xl relative overflow-hidden border border-slate-100">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900">AI Deep Scan: {selectedDetail.name}</h2>
                <p className="text-[10px] font-black text-[#B22830] uppercase tracking-[0.3em] mt-3">Dữ liệu phân tích từ CRM n8n Intelligence</p>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Phản hồi tiêu cực</p>
                  <div className="space-y-4">
                    {selectedDetail.stats.badComments.length > 0 ? (
                      selectedDetail.stats.badComments.map((msg, i) => (
                        <p key={i} className="text-[13px] font-bold text-slate-600 italic bg-white p-5 rounded-2xl border border-slate-50 shadow-sm leading-relaxed">"{msg}"</p>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic font-medium">Hạng mục này hiện không có phản hồi tiêu cực nào.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} /> Retention Strategy</p>
                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 shadow-sm">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedDetail.aiStrategy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Risk & Recovery</p>
                  <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 shadow-sm">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">{selectedDetail.riskAnalysis}</p>
                    <div className="h-px bg-red-200/50 my-4"></div>
                    <p className="text-[11px] text-red-800 font-black italic uppercase">Hành động khắc phục: {selectedDetail.recovery}</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedDetail(null)} className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#B22830] transition-all">
              ĐÓNG BÁO CÁO PHÂN TÍCH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentPage;