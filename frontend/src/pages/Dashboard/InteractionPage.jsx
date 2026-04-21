import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { getHighlandReviews, approveReviewReply } from "../../api/reviewApi";
import { toast } from 'react-hot-toast'; // QUAN TRỌNG: Cần import cái này
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const InteractionPage = () => {
  const [isProcessing, setIsProcessing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ churnRisk: 0, highRetention: 0 });
  const [selectedBranch, setSelectedBranch] = useState("Tất cả");
  const [selectedRating, setSelectedRating] = useState("Tất cả");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
  try {
    setLoading(true);
    // 1. Thêm tham số lấy nhiều dữ liệu hơn nếu API cho phép
    const response = await getHighlandReviews({ limit: 1000, page: 1 }); 
    
    const data = response.items || [];
    setReviews(data.filter(r => r.reply_status !== 'approved'));

    if (response.stats) {
      setStats({ 
        churnRisk: response.stats.churnRisk,      
        highRetention: response.stats.highRetention 
      });
    }
    setLoading(false);
  } catch (err) {
    console.error("Lỗi:", err);
    setLoading(false);
  }
};

  // 1. Lấy danh sách chi nhánh (giữ nguyên logic cũ của bạn)
  const branches = [
    "Tất cả", 
    ...new Set(reviews.map(item => item.address || "Chưa xác định"))
  ];
  // 2. Logic lọc kép: lọc theo Chi nhánh VÀ lọc theo Số sao
    const filteredReviews = reviews.filter(r => {
    // Lọc theo địa chỉ cửa hàng (address)
    const branchMatch = selectedBranch === "Tất cả" || r.address === selectedBranch;

    // Lọc theo số sao
    const ratingMatch = selectedRating === "Tất cả" || Number(r.rating) === Number(selectedRating);
    
    return branchMatch && ratingMatch;
  });
  const handleApprove = async (id) => {
    const textarea = document.getElementById(`reply-${id}`);
    const replyContent = textarea ? textarea.value : "";
    
    if (!replyContent) {
      toast.error("Vui lòng nhập nội dung phản hồi!");
      return;
    }

    try {
      setIsProcessing(id);
      await approveReviewReply(id, replyContent);
      toast.success('Đã phê duyệt & cập nhật CRM!', {
        style: { background: '#B22830', color: '#fff', fontWeight: 'bold' },
        icon: '🚀'
      });
      loadReviews();
    } catch (err) {
      toast.error('Có lỗi xảy ra, thử lại sau!');
    } finally {
      setIsProcessing(null);
    } 
  };

  // Xuat file excel
  const handleExportExcel = () => {
    toast.loading("Đang chuẩn bị file báo cáo...");
    const reportData = [
      { "DANH MỤC": "Nguy cơ rời bỏ (Churn Risk)", "SỐ LƯỢNG": stats.churnRisk },
      { "DANH MỤC": "Khách hàng trung thành (Retention)", "SỐ LƯỢNG": stats.highRetention },
      { "DANH MỤC": "Phản hồi đang chờ xử lý", "SỐ LƯỢNG": reviews.length },
      { "DANH MỤC": "Ngày xuất báo cáo", "SỐ LƯỢNG": new Date().toLocaleString() }
    ];
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo Highlands");
    XLSX.writeFile(wb, `Bao_Cao_CRM_${new Date().getTime()}.xlsx`);
    toast.dismiss();
    toast.success("Đã tải báo cáo Excel!");
  };

  // Dữ liệu cho biểu đồ
  const chartData = [
    { name: 'Nguy cơ rời bỏ', value: stats.churnRisk },
    { name: 'Khách hàng trung thành', value: stats.highRetention },
  ];
  const COLORS = ['#B22830', '#16a34a'];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-red-600 font-bold">Đang đồng bộ dữ liệu Highlands...</p>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* PHẦN BIỂU ĐỒ VÀ THỐNG KÊ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[200px]">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={chartData} innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-4">
            <p className="text-xs font-bold text-gray-400 uppercase">Tỷ lệ khách hàng</p>
            <p className="text-sm font-bold text-red-600">● Churn: {stats.churnRisk}</p>
            <p className="text-sm font-bold text-green-600">● Loyal: {stats.highRetention}</p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-red-600 p-6 rounded-xl shadow-sm flex flex-col justify-center hover:shadow-md transition-all">
          <h4 className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Churn Risk (Nguy cơ rời bỏ)</h4>
          <p className="text-4xl font-black text-red-600 my-1">{stats.churnRisk}</p>
          <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded">Ưu tiên xử lý khiếu nại & tặng voucher.</p>
        </div>
        
        <div className="bg-white border-l-4 border-green-600 p-6 rounded-xl shadow-sm flex flex-col justify-center hover:shadow-md transition-all">
          <h4 className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Retention (Khách hàng trung thành)</h4>
          <p className="text-4xl font-black text-green-600 my-1">{stats.highRetention}</p>
          <p className="text-[11px] text-green-700 bg-green-50 p-2 rounded">Duy trì tương tác & ưu đãi thẻ thành viên.</p>
        </div>
      </div>

      {/* THANH CÔNG CỤ: TIÊU ĐỀ + BỘ LỌC + NÚT BẤM */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-[#B22830] text-white px-3 py-1 rounded-lg shadow-lg">CRM</span> 
          Hộp thư ({filteredReviews.length})
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc Sao */}
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase italic">Đánh giá:</span>
            <select 
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="text-sm font-bold outline-none bg-transparent cursor-pointer text-yellow-600"
            >
              <option value="Tất cả">Tất cả sao</option>
              <option value="5">5 ★★★★★</option>
              <option value="4">4 ★★★★</option>
              <option value="3">3 ★★★</option>
              <option value="2">2 ★★</option>
              <option value="1">1 ★</option>
            </select>
          </div>

          {/* Lọc Chi nhánh */}
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase italic">Chi nhánh:</span>
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-sm font-bold outline-none bg-transparent cursor-pointer text-slate-700 max-w-[150px]"
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          <button 
            onClick={handleExportExcel}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            📊 Xuất Excel
          </button>

          <button 
            onClick={loadReviews} 
            className="bg-[#B22830] text-white px-4 py-2 rounded-lg hover:bg-red-800 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📩</div>
            <p className="text-gray-400 text-lg font-medium">Không tìm thấy phản hồi nào khớp với bộ lọc.</p>
          </div>
        ) : (
          filteredReviews.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.01] transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center font-bold text-lg border border-red-100 shadow-inner">
                    {item.author ? item.author.charAt(0) : "K"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      {item.author || "Khách hàng ẩn danh"}
                      {Number(item.rating) <= 2 && (
                        <span className="text-[9px] bg-red-600 text-white px-2 py-1 rounded-md uppercase font-black">Cảnh báo rủi ro</span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium italic">
                      📍 {item.address || "Highlands Coffee"} • {item.published_at || "Vừa xong"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 shadow-sm">
                  <span className="text-yellow-700 font-black">{item.rating}</span>
                  <span className="text-yellow-500 text-sm">★</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl mb-6 border-l-4 border-slate-300 relative shadow-inner">
                <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 rounded">Nội dung review</div>
                <p className="text-gray-700 italic text-sm leading-relaxed">"{item.review_text}"</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Gợi ý phản hồi:</label>
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                    Đã bật AI
                  </span>
                </div>
                
                <textarea
                  id={`reply-${item._id}`}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm leading-relaxed shadow-inner hover:border-gray-300 transition-all"
                  rows="3"
                  defaultValue={item.draft_reply || `Chào bạn ${item.author}, Highlands Coffee xin ghi nhận...`}
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                <button className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors">Hủy bỏ</button>
                <button
                  onClick={() => handleApprove(item._id)}
                  disabled={isProcessing === item._id}
                  className="bg-[#B22830] text-white px-10 py-3 rounded-xl font-black hover:bg-red-800 transition-all active:scale-95 shadow-lg shadow-red-100 uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                  {isProcessing === item._id ? "Đang xử lý..." : "Phê duyệt & Gửi"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InteractionPage;