import React, { useEffect, useState } from "react";
import { getHighlandReviews, approveReviewReply } from "../../api/reviewApi";

const InteractionPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ churnRisk: 0, highRetention: 0 });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
  try {
    setLoading(true);
    const response = await getHighlandReviews();
    
    // Lấy danh sách review hiển thị
    const data = response.items || [];
    setReviews(data.filter(r => r.reply_status !== 'approved'));

    // CẬP NHẬT TẠI ĐÂY:
    // Thay vì tự filter ở frontend (chỉ thấy 10 cái), 
    // ta lấy trực tiếp con số tổng mà Backend đã đếm trên 97 cái.
    if (response.stats) {
      setStats({ 
        churnRisk: response.stats.churnRisk,      // Con số 97 (hoặc bao nhiêu đó tuỳ DB) sẽ hiện ở đây
        highRetention: response.stats.highRetention 
      });
    }

    setLoading(false);
  } catch (err) {
    console.error("Lỗi:", err);
    setLoading(false);
  }
};

  // Workflow 3: Xử lý phê duyệt và lưu phản hồi
  const handleApprove = async (id) => {
    const textarea = document.getElementById(`reply-${id}`);
    const replyContent = textarea ? textarea.value : "";
    
    if (!replyContent) {
      alert("Vui lòng nhập nội dung phản hồi!");
      return;
    }

    try {
      // Gọi API PATCH đã chuyển sang dùng ReviewHighland model
      await approveReviewReply(id, replyContent);
      alert("✅ Đã phê duyệt và cập nhật vào CRM Highlands!");
      loadReviews(); // Tải lại danh sách để ẩn review vừa duyệt
    } catch (err) {
      console.error("Lỗi phê duyệt:", err);
      alert("❌ Lỗi: Không thể kết nối API phê duyệt.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-red-600 font-bold">Đang tải dữ liệu Highlands Coffee...</p>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* PHẦN CHIẾN LƯỢC CRM (Workflow 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-l-4 border-red-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Churn Risk (Nguy cơ rời bỏ)</h4>
          <p className="text-4xl font-black text-red-600 my-2">{stats.churnRisk}</p>
          <p className="text-sm text-red-700 bg-red-50 p-2 rounded">Cần gửi tin nhắn xin lỗi hoặc tặng voucher giảm giá.</p>
        </div>
        
        <div className="bg-white border-l-4 border-green-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Retention (Khách hàng trung thành)</h4>
          <p className="text-4xl font-black text-green-600 my-2">{stats.highRetention}</p>
          <p className="text-sm text-green-700 bg-green-50 p-2 rounded">Khách hàng tích cực - Đề xuất tặng thẻ Gold/Platium.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-[#B22830] text-white px-3 py-1 rounded-lg shadow-lg">CRM</span> 
          Hộp thư tương tác ({reviews.length})
        </h1>
        <button 
          onClick={loadReviews}
          className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
        >
          🔄 Làm mới
        </button>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📩</div>
            <p className="text-gray-400 text-lg font-medium">Hộp thư trống. Tất cả phản hồi đã được phê duyệt!</p>
          </div>
        ) : (
          reviews.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center font-bold text-lg border border-red-100">
                    {item.author ? item.author.charAt(0) : "K"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      {item.author || "Khách hàng ẩn danh"}
                      {Number(item.rating) <= 2 && (
                        <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-md uppercase font-black tracking-tighter">Xử lý khẩn cấp</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">{item.published_at || "Vừa xong"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                  <span className="text-yellow-700 font-black">{item.rating}</span>
                  <span className="text-yellow-500 text-sm">★</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl mb-6 border-l-4 border-slate-300 relative">
                <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 rounded">Nội dung review</div>
                <p className="text-gray-700 italic text-sm leading-relaxed">"{item.review_text}"</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Phản hồi của Highlands Coffee (AI đề xuất):</label>
                  <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase">
                    <span className="animate-pulse">●</span> AI Assistant
                  </span>
                </div>
                
                <textarea
                  id={`reply-${item._id}`}
                  className="w-full p-5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm leading-relaxed shadow-inner transition-all hover:border-gray-300"
                  rows="3"
                  defaultValue={
                    item.draft_reply || 
                    `Chào bạn ${item.author}, Highlands Coffee rất cảm ơn đóng góp của bạn. Chúng tôi đã ghi nhận phản hồi về dịch vụ tại cửa hàng và sẽ làm việc với quản lý khu vực để cải thiện ngay. Rất mong được đón tiếp bạn trở lại!`
                  }
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                <button className="text-gray-400 hover:text-gray-600 text-sm font-bold uppercase tracking-widest transition-colors">Lưu nháp</button>
                <button
                  onClick={() => handleApprove(item._id)}
                  className="bg-[#B22830] text-white px-10 py-3 rounded-xl font-black hover:bg-red-800 transition-all transform active:scale-95 shadow-xl shadow-red-100 uppercase text-xs tracking-widest"
                >
                  Phê duyệt & Gửi
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