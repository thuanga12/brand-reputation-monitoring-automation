import ReviewHighland from "../models/ReviewHighland.js";

export const getHighlandReviews = async (req, res) => {
  try {
    // 1. Lấy tham số filter từ req.query
    const { page = 1, limit = 10, sentiment, category, is_crisis } = req.query;

    // 2. Khởi tạo query lọc dữ liệu
    let query = {};
    if (sentiment) query.sentiment = sentiment;
    if (category) query.category = category;
    if (is_crisis !== undefined && is_crisis !== '') {
      query.is_crisis = is_crisis === 'true'; 
    }

    // 3. LOGIC MỚI: Thống kê toàn bộ dữ liệu (không bị ảnh hưởng bởi limit/page)
    // Điều này giúp bạn luôn có con số 97 (Churn Risk) cho dù đang ở trang nào
    const [stats, items, total] = await Promise.all([
      // Tính toán stats trên toàn bộ collection reviewshighland
      ReviewHighland.aggregate([
        {
          $facet: {
            churnRisk: [
              { $match: { rating: { $lte: 2 } } },
              { $count: "count" }
            ],
            highRetention: [
              { $match: { rating: { $gte: 4 } } },
              { $count: "count" }
            ]
          }
        }
      ]),
      // Lấy danh sách review cho trang hiện tại
      ReviewHighland.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      // Tổng số bản ghi theo query lọc
      ReviewHighland.countDocuments(query)
    ]);

    // Trích xuất số liệu từ aggregate
    const churnRiskCount = stats[0].churnRisk[0]?.count || 0;
    const highRetentionCount = stats[0].highRetention[0]?.count || 0;

    // 4. Trả về dữ liệu đầy đủ cho Frontend
    res.json({
      items,
      total,
      stats: {
        churnRisk: churnRiskCount,      // Đây sẽ là con số 97 bạn cần
        highRetention: highRetentionCount
      },
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Highland error:", error);
    res.status(500).json({ message: error.message });
  }
};
// Hàm xóa review dành cho Admin
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await ReviewHighland.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Không tìm thấy review để xóa" });
    }

    res.json({ message: "Đã xóa review thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};