
import ReviewHighland from "../models/ReviewHighland.js"; 
import CRM from "../models/CRM.js";

// API 1: Phê duyệt phản hồi
export const approveReviewReply = async (req, res) => {
  const { id } = req.params;
  const { final_reply } = req.body;

  try {
    // 2. Bây giờ dùng ReviewHighland ở đây là chạy mượt luôn
    const updatedReview = await ReviewHighland.findByIdAndUpdate(
      id,
      { 
        draft_reply: final_reply, 
        reply_status: "approved", 
        resolved: true 
      },
      { returnDocument: 'after' } 
    );
    
    if (!updatedReview) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi!" });
    }
    
    res.status(200).json({ message: "Đã duyệt thành công!", data: updatedReview });
  } catch (error) {
    // Log lỗi ra để nếu có sai gì khác còn biết đường sửa
    console.error("Lỗi tại approveReviewReply:", error.message); 
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

// API 2: Lấy dữ liệu chiến lược CRM (Churn risk, Recovery, Retention)
// Nhiệm vụ của Bạn C: Trả về dữ liệu từ n8n cho Frontend
// Lấy dữ liệu chiến lược CRM (Churn risk, Recovery, Retention)
export const getCRMStrategy = async (req, res) => {
  try {
    // Đảm bảo lấy bản ghi mới nhất từ collection 'quantrikhachhang'
    const strategy = await CRM.findOne().sort({ _id: -1 });

    if (!strategy) {
      return res.status(200).json({
        churn_reason: "Đang phân tích dữ liệu...",
        recovery_action: "Đang chờ kết quả từ AI...",
        loyalty_hook: "Đang chờ kết quả từ AI...",
        retention_action: "Đang chờ kết quả từ AI..."
      });
    }

    res.status(200).json(strategy);
  } catch (error) {
    console.error("Lỗi Backend CRM:", error);
    res.status(500).json({ message: "Lỗi kết nối Database" });
  }
};