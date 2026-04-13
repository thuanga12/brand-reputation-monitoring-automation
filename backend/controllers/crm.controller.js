import CRM from "../models/CRM.js"; // Nhớ đuôi .js

export const getCRMReports = async (req, res) => {
  try {
    // Lấy dữ liệu báo cáo mới nhất từ MongoDB Atlas
    const items = await CRM.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};