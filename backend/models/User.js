import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, // THÊM DÒNG NÀY
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', userSchema); // Dùng export default