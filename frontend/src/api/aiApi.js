import axiosClient from "./axios";

export const askAIConsultant = async (message, history = []) => {
  try {
    const res = await axiosClient.post("/ai/chat", { message, history });
    return res.data;
  } catch (error) {
    console.error("Lỗi gọi API AI Consultant:", error);
    throw error;
  }
};

export const getAIChatHistory = async () => {
  try {
    const res = await axiosClient.get("/ai/history");
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch sử chat:", error);
    throw error;
  }
};

export const clearAIChatHistory = async () => {
  try {
    const res = await axiosClient.delete("/ai/history");
    return res.data;
  } catch (error) {
    console.error("Lỗi xóa lịch sử chat:", error);
    throw error;
  }
};
