import ReviewHighland from "../models/ReviewHighland.js";

export const getHighlandReviews = async (req, res) => {
  try {
    // 1. Lấy thêm "address" từ req.query
    const { page = 1, limit = 10, sentiment, category, is_crisis, address } = req.query;

    // 2. Khởi tạo query lọc dữ liệu
    let query = {};
    if (sentiment) query.sentiment = sentiment;
    if (category) query.category = category;
    if (is_crisis !== undefined && is_crisis !== '') {
      query.is_crisis = is_crisis === 'true'; 
    }

    // FIX CHỐT HẠ: Thêm lọc địa chỉ vào đây
    if (address && address !== "" && address !== "Tất cả") {
      query.address = address; 
    }

    // 3. Thực hiện song song: Thống kê và Lấy dữ liệu theo query đã lọc
    const [stats, items, total] = await Promise.all([
      // Stats này thường để hiện biểu đồ tổng, nên không cần filter theo address 
      // (Hoặc nếu muốn biểu đồ cũng đổi theo địa chỉ thì thêm query vào $match)
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
      // Lấy danh sách review TRANG HIỆN TẠI có áp dụng lọc địa chỉ
      ReviewHighland.find(query)
        .sort({ published_at: -1 }) // Hoặc createdAt tùy schema của bạn
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      // Tổng số bản ghi CỦA RIÊNG ĐỊA CHỈ ĐÓ để phân trang
      ReviewHighland.countDocuments(query)
    ]);

    const churnRiskCount = stats[0].churnRisk[0]?.count || 0;
    const highRetentionCount = stats[0].highRetention[0]?.count || 0;

    res.json({
      items,
      total,
      stats: {
        churnRisk: churnRiskCount,
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