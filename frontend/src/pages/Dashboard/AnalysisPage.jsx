import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShieldAlert, TrendingUp, Sparkles, MapPin, Zap, Info } from 'lucide-react';

const AnalysisPage = () => {
  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => axiosClient.get('/competitors').then(res => res.data)
  });

  if (isLoading) return (
    <div className="p-20 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#B22830] border-t-transparent mb-4"></div>
      <p className="text-slate-400 font-medium italic">Đang phân tích vị thế thị trường...</p>
    </div>
  );

  // Tìm các brand chính
  const bH = competitors?.find(c => c.brand_name?.toLowerCase().includes('highlands')) || {
    service_score: 8.0, product_score: 8.5, vibe_score: 7.5, positive_rate: 0.82
  };
  const bP = competitors?.find(c => c.brand_name?.toLowerCase().includes('phúc long')) || {
    service_score: 7.2, product_score: 9.0, vibe_score: 6.8, positive_rate: 0.75
  };
  const bK = competitors?.find(c => c.brand_name?.toLowerCase().includes('katinat')) || {
    service_score: 8.5, product_score: 8.2, vibe_score: 9.2, positive_rate: 0.88
  };

  const radarData = [
    { subject: 'Dịch vụ', Highlands: bH.service_score, PhucLong: bP.service_score, Katinat: bK.service_score },
    { subject: 'Sản phẩm', Highlands: bH.product_score, PhucLong: bP.product_score, Katinat: bK.product_score },
    { subject: 'Không gian', Highlands: bH.vibe_score, PhucLong: bP.vibe_score, Katinat: bK.vibe_score },
    { subject: 'Hài lòng', Highlands: bH.positive_rate * 10, PhucLong: bP.positive_rate * 10, Katinat: bK.positive_rate * 10 },
    { subject: 'Quy mô', Highlands: 9.5, PhucLong: 8.0, Katinat: 7.5 },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Danh tiếng Thương hiệu</h2>
        </div>
        <div className="flex gap-3 no-print">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Xuất báo cáo
          </button>
          <button className="px-4 py-2 bg-[#B22830] text-white rounded-xl text-sm font-bold hover:bg-[#8e1f25] transition-all shadow-md">
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Radar Chart Box */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-center min-h-[500px]">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                
                <Radar 
                  name="Highlands" dataKey="Highlands" 
                  stroke="#B22830" fill="#B22830" fillOpacity={0.2} 
                  strokeWidth={3}
                />
                <Radar 
                  name="Phuc Long" dataKey="PhucLong" 
                  stroke="#059669" fill="#059669" fillOpacity={0.15} 
                  strokeWidth={2}
                />
                <Radar 
                  name="Katinat" dataKey="Katinat" 
                  stroke="#D97706" fill="#D97706" fillOpacity={0.15} 
                  strokeWidth={2}
                />
                
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontWeight: 'bold' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Insights & AI Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Strength Card */}
          <div className="bg-[#B22830] p-7 rounded-[32px] text-white shadow-xl shadow-red-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={80} />
            </div>
            <h3 className="text-xl font-bold mb-4 leading-tight">
              Top Strength: Vị trí đắc địa, sản phẩm có tính nhất quán cao, Phindi kem sữa và trà sen được yêu thích.
            </h3>
            <p className="text-sm text-red-50 leading-relaxed italic border-l-2 border-white/30 pl-4">
              "Cần tập trung vào tốt đào tạo kỹ năng mềm cho nhân viên và thiết lập quy trình kiểm soát chất lượng..."
            </p>
          </div>

          {/* Painpoints Radar Card */}
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest">
              <ShieldAlert size={16} />
              <span>Painpoints Radar</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Đối thủ đe dọa nhất</h4>
                <p className="font-bold text-slate-800">Katinat</p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mô tả</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Katinat là đối thủ lớn nhất hiện nay: điểm dịch vụ (7.5), sản phẩm (7.8) và vibe (8) 
                  vượt trội so với Highlands. Katinat tập trung vào tệp khách hàng trẻ trung, có không gian lifestyle hiện đại.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-start gap-2">
                <Info size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-red-500 leading-relaxed font-medium">
                  Dữ liệu AI chỉ ra: Thái độ nhân viên thiếu chuyên nghiệp, quản lý vận hành lỏng lẻo tại giờ cao điểm, 
                  tình trạng thiếu hụt topping/đá quá nhiều là rào cản lớn nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Detailed Competitor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Phuc Long Card */}
        <div className="bg-[#F0FDF4] p-8 rounded-[32px] border border-green-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#059669] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-green-100">
              PL
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Phúc Long Analysis</h3>
              <div className="flex items-center gap-1 text-[#059669] text-[10px] font-bold uppercase tracking-widest">
                <Zap size={12} />
                <span>Competitor Strength</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest">Sản phẩm mới & Phân tích cạnh tranh</h4>
              <p className="text-slate-700 leading-relaxed"><span className="font-bold">Món mới:</span> {bP.new_launch || 'Chưa có'}</p>
            </div>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Ưu điểm:</span> {bP.key_strengths || 'Chất lượng đồ uống ổn định, hương vị trà đậm đà.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Điểm yếu:</span> {bP.customer_painpoints || 'Thời gian chờ đợi lâu, quy trình xử lý đơn hàng còn thủ công.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Vị thế so với Highlands:</span> {bP.vs_highlands || 'Phúc Long tập trung vào chất lượng trà tốt hơn nhưng trải nghiệm dịch vụ chưa vượt trội.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Chiến lược đề xuất:</span> {bP.strategic_advice || 'Tối ưu hóa quy trình order tại quầy để giảm thời gian chờ đợi.'}</p>
            
            <div className="bg-white/50 p-5 rounded-2xl border border-green-200/50">
              <h5 className="text-[10px] font-black text-green-700 uppercase mb-2 tracking-widest">Action Items</h5>
              <ul className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 font-medium">
                <li>Áp dụng công nghệ quản lý đơn hàng tại quầy</li>
                <li>Cải thiện tốc độ phục vụ giờ cao điểm</li>
                <li>Duy trì chất lượng cốt trà</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Katinat Card */}
        <div className="bg-[#FFFBEB] p-8 rounded-[32px] border border-amber-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D97706] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-100">
              KT
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Katinat Insight</h3>
              <div className="flex items-center gap-1 text-[#D97706] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={12} />
                <span>Market Disruptor</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Ghi chú từ AI Intelligence</h4>
              <p className="text-slate-700 leading-relaxed"><span className="font-bold">Món mới:</span> {bK.new_launch || 'Chưa có'}</p>
            </div>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Ưu điểm:</span> {bK.key_strengths || 'Không gian hiện đại, thiết kế bắt mắt phù hợp giới trẻ, dịch vụ thân thiện.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Thách thức:</span> {bK.customer_painpoints || 'Giá thành cao so với mặt bằng chung, không gian đôi khi quá ồn ào.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Vị thế so với Highlands:</span> {bK.vs_highlands || 'Katinat chiếm ưu thế tuyệt đối về vibe và trải nghiệm khách hàng, tạo cảm giác thân thiện.'}</p>
            <p className="text-slate-700 leading-relaxed"><span className="font-bold">Chiến lược đề xuất:</span> {bK.strategic_advice || 'Duy trì định vị phong cách sống (lifestyle) và không gian hiện đại.'}</p>
            
            <div className="bg-white/50 p-5 rounded-2xl border border-amber-200/50">
              <h5 className="text-[10px] font-black text-amber-700 uppercase mb-2 tracking-widest">Action Items</h5>
              <ul className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 font-medium">
                <li>Giữ vững thẩm mỹ thiết kế</li>
                <li>Đa dạng hóa menu thức uống theo mùa</li>
                <li>Cải thiện độ cách âm tại các chi nhánh đông đúc</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisPage;
