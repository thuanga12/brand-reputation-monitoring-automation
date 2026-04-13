import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review_id: String,
    place_id: String,
    title: String,
    address: String,
    author: String,
    rating: Number,
    review_text: String,
    sentiment: String,
    category: String,
    crisis_score: Number,
    is_crisis: Boolean,
    draft_reply: String,
    reply_status: String,
    resolved: Boolean,
    source: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "ReviewHighland",
  reviewSchema,
  "reviewshighland"
);