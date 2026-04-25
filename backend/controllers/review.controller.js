import Review from "../models/Review.js";

// Lấy danh sách review kèm bộ lọc (Bạn A và Bạn B dùng)
// Lấy danh sách review kèm bộ lọc (Bạn A và Bạn B dùng)
export const getReviews = async (req, res) => {
  try {
    // 1. Thêm "address" vào để hứng dữ liệu từ Frontend gửi lên
    const { sentiment, is_crisis, address, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (sentiment) query.sentiment = sentiment;
    
    if (is_crisis !== undefined && is_crisis !== "") {
      query.is_crisis = is_crisis === "true";
    }

    // 2. FIX CHỐT HẠ: Thêm điều kiện lọc theo địa chỉ vào query của MongoDB
    // Nếu có địa chỉ và không phải là "Tất cả" thì mới lọc
    if (address && address !== "" && address !== "Tất cả") {
      query.address = address; 
    }

    const skip = (Number(page) - 1) * Number(limit);

    // 3. Thực hiện truy vấn với query đã có address
    const items = await Review.find(query)
      .sort({ published_at: -1 }) // Thường field này trong DB của bạn là published_at hoặc createdAt
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments(query);

    res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 review
export const getReviewById = async (req, res) => {
  try {
    const item = await Review.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Review not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật phản hồi (Bạn C dùng để sửa draft_reply)
export const updateReply = async (req, res) => {
  try {
    const { draft_reply, reply_status } = req.body;

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { draft_reply, reply_status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu review đã được xử lý xong
export const resolveReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controllers/review.controller.js

export const getCompetitorHighlights = async (req, res) => {
  try {
    const { brand, type } = req.query; // brand: 'Phúc Long' | 'Katinat', type: 'Tích cực' | 'Tiêu cực'

    const query = {
      // Tìm trong field title hoặc review_text có chứa tên thương hiệu
      title: { $regex: brand, $options: 'i' }
    };

    if (type) query.sentiment = type;

    const reviews = await Review.find(query)
      .sort({ rating: type === 'Tích cực' ? -1 : 1, published_at: -1 })
      .limit(3); // Chỉ lấy 3 cái "đắt" nhất để tránh làm nặng UI

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};