const mongoose = require('mongoose');

const sosanhSchema = new mongoose.Schema({
  report_date: { type: String, required: true }, // Format: YYYY-MM-DD
  brand_name: { type: String, required: true },
  total_reviews: { type: Number, default: 0 },
  positive_rate: { type: Number, default: 0 },
  negative_rate: { type: Number, default: 0 },
  service_score: { type: Number, default: 0 },
  product_score: { type: Number, default: 0 },
  vibe_score: { type: Number, default: 0 },
  new_launch: { type: String },
  key_strengths: { type: String },
  customer_painpoints: { type: String },
  vs_highlands: { type: String },
  strategic_advice: { type: String },
  action_items: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Sosanh', sosanhSchema, 'sosanh');