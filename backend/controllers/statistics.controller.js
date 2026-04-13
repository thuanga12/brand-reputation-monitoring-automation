import Review from "../models/Review.js";

export const getStatistics = async (req, res) => {
  try {
    const total_reviews = await Review.countDocuments();
    const positive = await Review.countDocuments({ sentiment: "Tích cực" });
    const neutral = await Review.countDocuments({ sentiment: "Trung lập" });
    const negative = await Review.countDocuments({ sentiment: "Tiêu cực" });
    const crisis = await Review.countDocuments({ is_crisis: true });

    res.json({
      total_reviews,
      positive,
      neutral,
      negative,
      crisis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};