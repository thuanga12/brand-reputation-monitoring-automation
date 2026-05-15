import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Lock, Camera, Save, Trash2, Mail } from 'lucide-react';
import imageCompression from 'browser-image-compression';
const ProfilePage = () => {
  // Lấy dữ liệu từ localStorage để khởi tạo form
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    username: storedUser?.username || '',
    avatar: storedUser?.avatar || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Xử lý chọn ảnh và chuyển sang Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) { // Giới hạn 1MB
       return toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB");
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate mật khẩu nếu người dùng muốn đổi
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/update-profile', 
        {
          username: formData.username,
          avatar: formData.avatar,
          password: formData.password || undefined // Chỉ gửi nếu có nhập
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        // Cập nhật lại localStorage để các trang khác (Sidebar) nhận diện được tên/ảnh mới
        const updatedUser = { ...storedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success("Cập nhật hồ sơ Highlands thành công! 🎉");
        
        // Reset mật khẩu sau khi đổi xong
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        
        // Tùy chọn: reload trang sau 1s để Sidebar cập nhật ngay
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-100 rounded-lg text-[#B22830]">
          <User size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT TRÁI: AVATAR */}
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-red-50 bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <span className="text-4xl font-bold text-slate-300">{formData.username.charAt(0)}</span>
                )}
              </div>
              <label className="absolute bottom-1 right-1 p-2 bg-[#B22830] text-white rounded-full cursor-pointer hover:scale-110 transition shadow-lg border-2 border-white">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <div className="text-center mt-4">
              <p className="font-bold text-slate-700 text-lg">{formData.username}</p>
              <span className="px-3 py-1 bg-red-50 text-[#B22830] text-[10px] font-bold rounded-full uppercase tracking-widest">
                {storedUser?.role || 'User'}
              </span>
            </div>
            
            <button 
              onClick={() => setFormData({...formData, avatar: ''})}
              className="mt-6 text-xs text-slate-400 flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} /> Xóa ảnh đại diện
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỈNH SỬA */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600 ml-1">Tên hiển thị</label>
                <div className="relative">
                   <User className="absolute left-3 top-3 text-slate-300" size={18} />
                   <input 
                    type="text" value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 focus:border-[#B22830] transition-all"
                    placeholder="Nhập tên của bạn..."
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-400 ml-1 italic">Email (Cố định)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-200" size={18} />
                  <input type="text" value={storedUser?.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 cursor-not-allowed italic" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4"><Lock size={18} className="text-red-500"/> Đổi mật khẩu mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="password" placeholder="Mật khẩu mới (bỏ trống nếu không đổi)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100"
                />
                <input 
                  type="password" placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#B22830] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#8e1f25] shadow-lg hover:shadow-red-200 transition-all disabled:bg-slate-300"
              >
                {loading ? "Đang lưu..." : <><Save size={20} /> Lưu thay đổi</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const options = {
    maxSizeMB: 0.2,          // Nén ảnh xuống tối đa 200KB
    maxWidthOrHeight: 800,   // Thu nhỏ kích thước ảnh
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onloadend = () => {
      // Dữ liệu lúc này đã rất nhẹ, gửi lên sẽ không còn lỗi 413
      setFormData({ ...formData, avatar: reader.result });
    };
  } catch (error) {
    console.error("Lỗi nén ảnh:", error);
  }
};
export default ProfilePage;