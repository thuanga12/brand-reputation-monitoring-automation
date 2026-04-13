import ReviewHighland from "../models/ReviewHighland.js";

export const getHighlandReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const items = await ReviewHighland.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ReviewHighland.countDocuments();

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