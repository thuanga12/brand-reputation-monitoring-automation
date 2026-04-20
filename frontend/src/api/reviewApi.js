import axiosClient from "./axios";

// Hàm cũ của bạn
export const getHighlandReviews = async (params = {}) => {
  // SỬA TẠI ĐÂY: Khớp với cái router.get("/highland", ...) ở Backend
  // Giả sử server của bạn cấu hình prefix là /api/reviews
  const res = await axiosClient.get("/reviews/highland", { params }); 
  return res.data;
};

export const approveReviewReply = async (id, finalReply) => {
  // Đảm bảo đường dẫn này khớp với route patch ở Backend
const res = await axiosClient.patch(`/crm/approve-reply/${id}`, {
  final_reply: finalReply,
  });
  return res.data;
};

// THÊM HÀM NÀY: Để lấy dữ liệu chung cho trang Phân tích cảm xúc
export const getAllReviews = async (params = {}) => {
  // Nếu server chưa có /reviews, hãy tạm dùng /reviews-highland để test cho hiện bảng
  const res = await axiosClient.get("/reviews", { params }); 
  return res.data;
};