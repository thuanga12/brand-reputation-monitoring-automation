import Competitor from "../models/Competitor.js";

export const getCompetitors = async (req, res) => {
  try {
    // Lấy tất cả dữ liệu so sánh, sắp xếp theo ngày mới nhất
    const competitors = await Competitor.find().sort({ report_date: -1 });
    
    if (!competitors || competitors.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu đối thủ" });
    }

    res.status(200).json(competitors);
  } catch (error) {
    res.status(500).json({ 
      message: "Lỗi server khi lấy dữ liệu đối thủ", 
      error: error.message 
    });
  }
};