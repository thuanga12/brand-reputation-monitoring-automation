import React from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '../../api/axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AnalysisPage = () => {
  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => instance.get('/competitors').then(res => res.data)
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400">Đang phân tích vị thế thị trường...</div>;

  // Giả lập dữ liệu Radar từ API
  const bH = competitors?.find(c => c.brand_name?.toLowerCase().includes('highlands'));
  const bP = competitors?.find(c => c.brand_name?.toLowerCase().includes('phúc long'));
  const bK = competitors?.find(c => c.brand_name?.toLowerCase().includes('katinat'));

  const radarData = [
    { subject: 'Dịch vụ', A: bH?.service_score || 8, B: bP?.service_score || 7, C: bK?.service_score || 9 },
    { subject: 'Sản phẩm', A: bH?.product_score || 9, B: bP?.product_score || 10, C: bK?.product_score || 8 },
    { subject: 'Không gian', A: bH?.vibe_score || 8, B: bP?.vibe_score || 6, C: bK?.vibe_score || 10 },
    { subject: 'Giá cả', A: 7, B: 6, C: 5 },
    { subject: 'Vị trí', A: 10, B: 8, C: 7 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Radar Chart Box */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800">🧑‍🤝‍🧑 Đối sánh năng lực</h2>
            <p className="text-slate-500 text-sm">Biểu đồ so sánh đa chiều giữa các thương hiệu hàng đầu</p>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="Highlands" dataKey="A" stroke="#B22830" fill="#B22830" fillOpacity={0.35} />
                <Radar name="Phúc Long" dataKey="B" stroke="#059669" fill="#059669" fillOpacity={0.15} />
                <Radar name="Katinat" dataKey="C" stroke="#d97706" fill="#d97706" fillOpacity={0.15} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Insight Cards */}
        <div className="space-y-4">
          <div className="bg-[#B22830] p-6 rounded-3xl text-white shadow-lg shadow-red-100">
            <h4 className="font-bold mb-2">💡 Insight Highlands</h4>
            <p className="text-sm opacity-90 text-red-50">Dẫn đầu tuyệt đối về vị trí đắc địa, nhưng cần cải thiện điểm số không gian so với Katinat.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">🛡️ Đối thủ rủi ro</h4>
            <p className="text-sm text-slate-500">Phúc Long đang có điểm số sản phẩm (vị trà) cao hơn 15% so với mặt bằng chung.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">⭐ Cơ hội mới</h4>
            <p className="text-sm text-slate-500">Dịch vụ tại Katinat được đánh giá cao nhờ thái độ nhân viên trẻ trung.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisPage;
