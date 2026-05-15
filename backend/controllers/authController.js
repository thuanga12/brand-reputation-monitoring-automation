import User from '../models/User.js'; // BẮT BUỘC có đuôi .js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
// Thay vì exports.register, hãy dùng export const register
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Kiểm tra user tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email đã tồn tại" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'vku_secret_key', 
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user được tạo ra từ middleware verifyToken trước đó
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Quyền hạn '${req.user.role}' không được phép thực hiện hành động này!` 
      });
    }
    next();
  };
};
// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Không lấy mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật Role hoặc trạng thái
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json({ message: "Cập nhật quyền thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa tài khoản
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa tài khoản" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Admin cập nhật thông tin cho bất kỳ User nào
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID của user cần sửa
    const { username, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (username) user.username = username;
    if (role) user.role = role;
    
    // Nếu Admin đổi mật khẩu cho nhân viên
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Đã cập nhật thông tin người dùng thành công!", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Cấu hình Cloudinary (Dùng thông số của bạn)
cloudinary.config({ 
  cloud_name: 'dupecsa75',          // SỬA THÀNH CÁI NÀY (Dòng chữ xanh trong ảnh)
  api_key: '889881134375954',       // Giữ nguyên
  api_secret: '-JpI08iBsLOPdY5be5mHHEPQu8c' // Giữ nguyên
});

export const updateProfile = async (req, res) => {
  try {
    const { username, password, avatar } = req.body;
    
    // Lưu ý: req.user.id lấy từ middleware verifyToken
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // 1. Xử lý Upload ảnh lên Cloudinary
    if (avatar && avatar.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: 'highlands_avatars',
      });
      user.avatar = uploadResponse.secure_url; 
    }

    // 2. Cập nhật Username
    if (username) user.username = username;

    // 3. Cập nhật Password (Đã bổ sung logic)
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // 4. Trả về data sạch cho Frontend
    res.json({ 
      message: "Cập nhật thành công!", 
      user: { 
        id: user._id, 
        username: user.username, 
        avatar: user.avatar, 
        role: user.role,
        email: user.email
      } 
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};