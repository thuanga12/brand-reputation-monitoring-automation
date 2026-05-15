import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/authApi'; // Tương tự ở đâyimport { toast } from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', email: '', password: '', role: 'user' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerApi(formData);
      toast.success('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký lỗi rồi!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#B22830] text-center mb-6">Tạo tài khoản</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Họ và tên" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="password" placeholder="Mật khẩu" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={20} />
            <select className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
              onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="user">Nhân viên (User)</option>
              <option value="manager">Quản lý (Manager)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>
          <button className="w-full bg-[#B22830] text-white font-bold py-2 rounded-lg hover:bg-[#8e1f25] transition">
            Đăng Ký
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="text-[#B22830] font-bold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;