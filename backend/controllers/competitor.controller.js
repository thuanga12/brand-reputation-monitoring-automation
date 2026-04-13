import mongoose from "mongoose";

// Định nghĩa Model để đọc collection 'sosanh'
const Comparison = mongoose.model('Comparison', new mongoose.Schema({}, { strict: false }), 'sosanh');

export const getCompetitors = async (req, res) => {
  try {
    // Lấy 3 bản ghi mới nhất từ n8n
    const competitors = await Comparison.find()
      .sort({ report_date: -1, _id: -1 })
      .limit(3);

    // Quy đổi tỷ lệ (0.52 -> 52%) để hiển thị trên Frontend
    const formattedData = competitors.map(item => ({
      ...item._doc,
      positive_rate: item.positive_rate ? (item.positive_rate * 100).toFixed(0) : 0,
      negative_rate: item.negative_rate ? (item.negative_rate * 100).toFixed(0) : 0
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu đối thủ", error: error.message });
  }
};