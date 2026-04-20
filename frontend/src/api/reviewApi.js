import axiosClient from "./axios";

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