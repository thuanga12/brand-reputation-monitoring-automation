
import ReviewHighland from "../models/ReviewHighland.js"; 

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