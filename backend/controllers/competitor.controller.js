import Competitor from "../models/Competitor.js"; 

export const getCompetitors = async (req, res) => {
  try {
    // Sau này bạn B sẽ viết code lấy dữ liệu thật từ MongoDB ở đây
    res.json({ message: "Dữ liệu đối thủ đã sẵn sàng" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};