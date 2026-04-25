import Competitor from "../models/Competitor.js";

export const getCompetitors = async (req, res) => {
  try {
    // Chỉ lấy 3 bản ghi mới nhất vừa được n8n đổ vào
    const competitors = await Competitor.find()
      .sort({ createdAt: -1 }) 
      .limit(3);
    
    if (!competitors || competitors.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    }

    res.status(200).json(competitors);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};