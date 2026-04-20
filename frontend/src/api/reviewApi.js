import axiosClient from "./axios";

// Hàm cũ của bạn
export const getHighlandReviews = async (params = {}) => {
  const res = await axiosClient.get("/reviews-highland", { params });
  return res.data;
};

// THÊM HÀM NÀY: Để lấy dữ liệu chung cho trang Phân tích cảm xúc
export const getAllReviews = async (params = {}) => {
  // Nếu server chưa có /reviews, hãy tạm dùng /reviews-highland để test cho hiện bảng
  const res = await axiosClient.get("/reviews", { params }); 
  return res.data;
};