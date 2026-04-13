import React from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '../../api/axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AnalysisPage = () => {
  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => instance.get('/competitors').then(res => res.data)
  });

  if (isLoading) return <div className="p-10 text-center">Đang phân tích dữ liệu đối thủ...</div>;

  // Format dữ liệu cho Radar Chart
  // Giả sử mảng trả về có 3 phần tử: 0: Highlands, 1: Phúc Long, 2: Katinat
  const radarData = [
    { subject: 'Dịch vụ', A: competitors[0]?.service_score, B: competitors[1]?.service_score, C: competitors[2]?.service_score, fullMark: 10 },
    { subject: 'Sản phẩm', A: competitors[0]?.product_score, B: competitors[1]?.product_score, C: competitors[2]?.product_score, fullMark: 10 },
    { subject: 'Không gian', A: competitors[0]?.vibe_score, B: competitors[1]?.vibe_score, C: competitors[2]?.vibe_score, fullMark: 10 },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Phân tích đối thủ cạnh tranh</h1>

      {/* 1. BIỂU ĐỒ RADAR */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">So sánh chỉ số vận hành (Scale 1-10)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 14 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Tooltip />
              <Radar name="Highlands" dataKey="A" stroke="#B91C1C" fill="#B91C1C" fillOpacity={0.5} />
              <Radar name="Phúc Long" dataKey="B" stroke="#059669" fill="#059669" fillOpacity={0.5} />
              <Radar name="Katinat" dataKey="C" stroke="#78350f" fill="#D97706" fillOpacity={0.5} />
              <Legend verticalAlign="bottom" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. THẺ INSIGHT CHI TIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {competitors.map((brand) => (
          <div key={brand._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 text-white font-bold ${brand.brand_name === 'Highlands Coffee' ? 'bg-red-700' : 'bg-gray-700'}`}>
              {brand.brand_name}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase">Ưu điểm nổi bật</span>
                <p className="text-sm text-gray-600 mt-1">{brand.key_strengths}</p>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-red-600 uppercase">Điểm yếu / Phàn nàn</span>
                <p className="text-sm text-gray-600 mt-1">{brand.customer_painpoints}</p>
              </div>
              <div className="pt-4 bg-blue-50 p-3 rounded-lg">
                <span className="text-xs font-bold text-blue-700 uppercase">💡 Lời khuyên chiến lược</span>
                <p className="text-xs text-blue-900 mt-1 italic">{brand.strategic_advice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPage;