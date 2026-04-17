import Review from "../models/Review.js";

// API: Phê duyệt phản hồi từ n8n draft
export const approveReviewReply = async (req, res) => {
  const { id } = req.params; // Lấy ID của review từ URL
  const { final_reply } = req.body; // Nội dung bạn đã chỉnh sửa từ Frontend gửi lên

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { 
        draft_reply: final_reply, 
        reply_status: "approved", // Trạng thái này cực kỳ quan trọng cho Workflow 3 n8n
        resolved: true 
      },
      { new: true } // Trả về dữ liệu mới nhất sau khi sửa
    );
    
    if (!updatedReview) {
      return res.status(404).json({ message: "Không tìm thấy review này trong hệ thống!" });
    }
    
    res.status(200).json({
      message: "Đã phê duyệt phản hồi thành công!",
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi phê duyệt", error: error.message });
  }
};