import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review_id: { type: String, unique: true },
    place_id: String,
    title: String, // Khớp với trường 'title' trong code n8n của bạn
    address: String,
    author: String,
    rating: Number,
    review_text: String,
    sentiment: String,
    category: String,
    crisis_score: Number,
    is_crisis: { type: Boolean, default: false },
    draft_reply: { type: String, default: "" }, // Bạn C sẽ dùng trường này để duyệt phản hồi
    reply_status: { type: String, default: "pending" },
    resolved: { type: Boolean, default: false },
    source: { type: String, default: "google_maps" }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);