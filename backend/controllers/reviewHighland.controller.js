import ReviewHighland from "../models/ReviewHighland.js";

export const getHighlandReviews = async (req, res) => {
  try {
    // 1. Lấy thêm các tham số filter từ req.query
    const { page = 1, limit = 10, sentiment, category, is_crisis } = req.query;

    // 2. Khởi tạo object query rỗng. Nếu frontend không gửi filter, nó sẽ lấy tất cả (như cũ).
    let query = {};

    // 3. Đắp thêm điều kiện lọc nếu có dữ liệu gửi lên
    if (sentiment) query.sentiment = sentiment;
    if (category) query.category = category;
    
    // Xử lý is_crisis vì req.query luôn trả về chuỗi (string)
    if (is_crisis !== undefined && is_crisis !== '') {
      query.is_crisis = is_crisis === 'true'; 
    }

    const skip = (Number(page) - 1) * Number(limit);

    // 4. Truyền biến query vào hàm find()
    const items = await ReviewHighland.find(query)
      .sort({ createdAt: -1 }) // Bạn có thể cân nhắc đổi thành { published_at: -1 } nếu muốn xếp theo ngày review thực tế thay vì ngày lưu vào DB
      .skip(skip)
      .limit(Number(limit));

    // 5. Truyền biến query vào countDocuments() để tính tổng số trang chính xác sau khi lọc
    const total = await ReviewHighland.countDocuments(query);

    res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Highland error:", error);
    res.status(500).json({ message: error.message });
  }
};