import jwt from 'jsonwebtoken';

// Middleware xác thực Token (Phải có cái này trước)
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token sau chữ 'Bearer'

  if (!token) return res.status(401).json({ message: "Truy cập bị từ chối. Không có token!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'vku_secret_key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ!" });
  }
};

// Middleware phân quyền (Lỗi của bạn nằm ở đây, phải có chữ export)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Bạn không có quyền truy cập. Yêu cầu quyền: ${roles.join(', ')}` 
      });
    }
    next();
  };
};