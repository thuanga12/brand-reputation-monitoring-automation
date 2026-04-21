import axiosClient from "./axios";

// 1. Lấy dữ liệu review chi tiết (Node: Insert documents / reviewshighland)
export const getHighlandReviews = async (params = {}) => {
  const res = await axiosClient.get("/reviews/highland", { params }); 
  return res.data;
};

// 2. Lấy báo cáo chiến lược AI (Node: Insert documents3 / quantrikhachhang)
// Hàm này cực kỳ quan trọng để đổ dữ liệu vào phần "AI Strategy Advice"
export const getCrmStrategy = async (params = {}) => {
  const res = await axiosClient.get("/crm/strategy", { params }); 
  return res.data;
};

// 3. Lấy chỉ số sức khỏe & từ khóa (Node: Insert documents5 / daily_reports)
// Hàm này cung cấp dữ liệu cho "Brand Health Index" và "Trend Forecast"
export const getDailyReports = async (params = {}) => {
  const res = await axiosClient.get("/crm/daily-reports", { params }); 
  return res.data;
};

export const approveReviewReply = async (id, finalReply) => {
  const res = await axiosClient.patch(`/crm/approve-reply/${id}`, {
    final_reply: finalReply,
  });
  return res.data;
};

export const getAllReviews = async (params = {}) => {
  const res = await axiosClient.get("/reviews", { params }); 
  return res.data;
};