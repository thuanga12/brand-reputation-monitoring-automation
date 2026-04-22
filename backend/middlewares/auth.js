const jwt = require('jsonwebtoken');

// Kiểm tra Token hợp lệ
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Không có quyền truy cập!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'vku_secret_key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ!" });
  }
};

// Kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Chỉ Admin mới có quyền này!" });
  }
  next();
};