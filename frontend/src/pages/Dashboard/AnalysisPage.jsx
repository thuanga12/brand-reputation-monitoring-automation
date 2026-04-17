import React from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '../../api/axios';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

const AnalysisPage = () => {
  // 1. Fetch dữ liệu từ API /api/competitors
  const { data: competitors, isLoading, isError } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => instance.get('/competitors').then(res => res.data)
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 text-slate-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B22830] mr-3"></div>
      Đang tải dữ liệu đối thủ...
    </div>
  );

  if (isError) return <div className="p-10 text-red-500 text-center text-sm">⚠️ Không thể kết nối đến Server hoặc dữ liệu trống.</div>;

  // 2. Map dữ liệu động cho Radar Chart (Tránh hard-code index)
  const brandH = competitors?.find(c => c.brand_name.toLowerCase().includes('highlands'));
  const brandP = competitors?.find(c => c.brand_name.toLowerCase().includes('phúc long'));
  const brandK = competitors?.find(c => c.brand_name.toLowerCase().includes('katinat'));

  const radarData = [
    { subject: 'Dịch vụ', A: brandH?.service_score, B: brandP?.service_score, C: brandK?.service_score },
    { subject: 'Sản phẩm', A: brandH?.product_score, B: brandP?.product_score, C: brandK?.product_score },
    { subject: 'Không gian', A: brandH?.vibe_score, B: brandP?.vibe_score, C: brandK?.vibe_score },
    { subject: 'Cảm xúc (+)', A: (brandH?.positive_rate || 0) * 10, B: (brandP?.positive_rate || 0) * 10, C: (brandK?.positive_rate || 0) * 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Khối biểu đồ */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">So sánh chỉ số vận hành</h3>
            <p className="text-xs text-slate-500">Dữ liệu cập nhật mới nhất: {brandH?.report_date || 'N/A'}</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1 text-red-700"><span className="w-2 h-2 bg-red-700 rounded-full"></span> Highlands</span>
            <span className="flex items-center gap-1 text-green-700"><span className="w-2 h-2 bg-green-700 rounded-full"></span> Phúc Long</span>
            <span className="flex items-center gap-1 text-amber-700"><span className="w-2 h-2 bg-amber-700 rounded-full"></span> Katinat</span>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
              <Radar name="Highlands" dataKey="A" stroke="#B22830" fill="#B22830" fillOpacity={0.4} />
              <Radar name="Phúc Long" dataKey="B" stroke="#15803d" fill="#15803d" fillOpacity={0.2} />
              <Radar name="Katinat" dataKey="C" stroke="#b45309" fill="#b45309" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Khối thẻ chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {competitors.map((brand) => {
          const isMe = brand.brand_name.toLowerCase().includes('highlands');
          return (
            <div key={brand._id} className={`bg-white rounded-xl border transition-all ${isMe ? 'border-red-200 shadow-md shadow-red-50' : 'border-slate-100 shadow-sm'}`}>
              <div className={`px-4 py-3 font-bold text-sm text-white flex justify-between ${isMe ? 'bg-[#B22830]' : 'bg-slate-700'}`}>
                {brand.brand_name}
                {isMe && <span className="bg-white text-[#B22830] text-[9px] px-1.5 py-0.5 rounded">MY BRAND</span>}
              </div>
              
              <div className="p-4 space-y-4">
                {/* Tỷ lệ cảm xúc Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-green-600">TÍCH CỰC: {(brand.positive_rate * 100).toFixed(0)}%</span>
                    <span className="text-red-600">TIÊU CỰC: {(brand.negative_rate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${brand.positive_rate * 100}%` }}></div>
                    <div className="bg-red-500 h-full" style={{ width: `${brand.negative_rate * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">🚀 Ưu điểm</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{brand.key_strengths}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">⚠️ Painpoints</h4>
                    <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">{brand.customer_painpoints}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisPage;