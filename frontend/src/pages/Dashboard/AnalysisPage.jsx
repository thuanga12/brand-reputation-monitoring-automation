import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompetitors } from "../../api/competitorApi";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { Sword, Target, Zap, AlertTriangle, Flame, ShieldCheck, TrendingUp } from 'lucide-react';

const AnalysisPage = () => {
  // 1. Gọi dữ liệu từ Service đã tách
  const { data: competitors, isLoading, isError } = useQuery({
    queryKey: ['competitors'],
    queryFn: getCompetitors,
    refetchInterval: 300000, // Tự động làm mới mỗi 5 phút (nếu n8n cập nhật)
  });

  // 2. Xử lý logic mapping dữ liệu từ MongoDB ra Chart
  const analysis = useMemo(() => {
    if (!competitors || competitors.length === 0) return null;
    
    // Tìm 3 thực thể dựa trên brand_name mà n8n đã lưu
    const h = competitors.find(c => c.brand_name?.toLowerCase().includes('highlands')) || {};
    const p = competitors.find(c => c.brand_name?.toLowerCase().includes('phúc long')) || {};
    const k = competitors.find(c => c.brand_name?.toLowerCase().includes('katinat')) || {};

    return {
      radar: [
        { subject: 'Dịch vụ', A: h.service_score || 0, B: p.service_score || 0, C: k.service_score || 0 },
        { subject: 'Sản phẩm', A: h.product_score || 0, B: p.product_score || 0, C: k.product_score || 0 },
        { subject: 'Không gian', A: h.vibe_score || 0, B: p.vibe_score || 0, C: k.vibe_score || 0 },
        // Chuyển positive_rate (0.65) -> Điểm 10 (6.5)
        { subject: 'Hài lòng', A: (h.positive_rate * 10) || 0, B: (p.positive_rate * 10) || 0, C: (k.positive_rate * 10) || 0 },
        { subject: 'Quy mô', A: 10, B: 7, C: 6 }, // Hardcode dựa trên định vị thị trường thực tế
      ],
      details: { h, p, k }
    };
  }, [competitors]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-[#B22830] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest">AI Market Intelligence Loading...</p>
    </div>
  );

  if (isError || !analysis) return (
    <div className="p-20 text-center font-bold text-red-500">
      Không thể kết nối với dữ liệu phân tích đối thủ.
    </div>
  );

  return (
    <div className="p-6 space-y-10 bg-[#FDFDFD] min-h-screen animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <TrendingUp className="text-[#B22830]" size={32} />
            Competitor Battleground
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-[0.3em]">
            Dữ liệu đối soát thực tế: {analysis.details.h.report_date || "N/A"}
          </p>
        </div>
      </div>

      {/* SECTION 1: RADAR & QUICK INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-xl border border-slate-100 relative">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic">Market Battle Radar</h2>
            <div className="p-3 bg-slate-50 rounded-2xl"><Sword className="text-[#B22830]" /></div>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.radar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12, fontWeight: 900}} />
                <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="Highlands" dataKey="A" stroke="#B22830" fill="#B22830" fillOpacity={0.5} strokeWidth={3} />
                <Radar name="Phúc Long" dataKey="B" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Katinat" dataKey="C" stroke="#d97706" fill="#d97706" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: '900', fontSize: '12px'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI QUICK SWOT */}
        <div className="space-y-6">
          <div className="bg-[#B22830] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <Zap className="absolute right-6 top-6 text-white/20 group-hover:scale-125 transition-transform" size={60} />
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-red-200">Highlands Advantage</h4>
            <p className="text-2xl font-black leading-tight mb-4">Top Strength: {analysis.details.h.key_strengths?.split(';')[0]}</p>
            <p className="text-sm font-medium opacity-80 italic">"{analysis.details.h.strategic_advice?.slice(0, 100)}..."</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><AlertTriangle size={20}/></div>
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Painpoints Radar</h4>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Đối thủ đe dọa nhất</span>
                  <span className="text-sm font-bold text-slate-700">{analysis.details.h.vs_highlands}</span>
               </div>
               <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Dữ liệu AI chỉ ra: <span className="text-red-500">{analysis.details.h.customer_painpoints}</span> là rào cản lớn nhất hiện tại.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: COMPETITOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phúc Long Heritage */}
        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white font-black">PL</div>
              <h3 className="text-xl font-black text-slate-900">Phúc Long Analysis</h3>
            </div>
            <ShieldCheck className="text-emerald-500" />
          </div>
          <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100">
             <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">Sản phẩm mới & Thế mạnh</p>
             <p className="text-sm font-bold text-slate-700 leading-relaxed">
                Món mới: {analysis.details.p.new_launch || "Không có"} <br/>
                Ưu điểm: {analysis.details.p.key_strengths}
             </p>
          </div>
        </div>

        {/* Katinat Coffee */}
        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black">KT</div>
              <h3 className="text-xl font-black text-slate-900">Katinat Insight</h3>
            </div>
            <Flame className="text-amber-500 animate-pulse" />
          </div>
          <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100">
             <p className="text-[10px] font-black text-amber-700 uppercase mb-2">Ghi chú từ AI Intelligence</p>
             <p className="text-sm font-bold text-slate-700 leading-relaxed">
                Thách thức: {analysis.details.k.customer_painpoints} <br/>
                Vị thế: {analysis.details.k.vs_highlands}
             </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: AI WAR ROOM STRATEGY */}
      <div className="bg-slate-900 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#B22830]/20 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1 bg-red-600 rounded-full text-[10px] font-black uppercase">Battle Order</span>
              <h2 className="text-3xl font-black uppercase tracking-tighter">AI-Driven Marketing Strategy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 font-medium text-lg leading-relaxed italic border-l-4 border-red-600 pl-6">
                "{analysis.details.h.strategic_advice}"
              </p>
              <p className="text-white font-bold text-sm bg-white/5 p-4 rounded-2xl">
                🚀 Action Plan: {analysis.details.h.action_items}
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-10 py-6 bg-[#B22830] hover:bg-red-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95">
             Generate Campaign Brief
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;