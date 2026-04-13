import Review from "../models/Review.js";

// Lấy danh sách review kèm bộ lọc (Bạn A và Bạn B dùng)
export const getReviews = async (req, res) => {
  try {
    const { sentiment, is_crisis, page = 1, limit = 10 } = req.query;

    const query = {};
    if (sentiment) query.sentiment = sentiment;
    
    // Sửa logic query Boolean để đảm bảo lọc đúng
    if (is_crisis !== undefined) {
      query.is_crisis = is_crisis === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Review.find(query)
      .sort({ createdAt: -1 }) // Ưu tiên review mới nhất lên đầu
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