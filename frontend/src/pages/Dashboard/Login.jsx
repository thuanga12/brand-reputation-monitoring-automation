import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/authApi'; // Phải là 2 dấu chấm và 2 cái gạch chéoimport { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginApi({ email, password });
      
      // Lưu Token và thông tin User vào LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success(`Chào mừng ${data.user.username} quay trở lại!`);
      
      // Chuyển hướng vào Dashboard
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <LogIn className="text-[#B22830]" size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#B22830] text-center mb-2">Đăng Nhập</h2>
        <p className="text-center text-gray-500 mb-8">Hệ thống giám sát Highlands Coffee</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" placeholder="Email của bạn" required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" placeholder="Mật khẩu" required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-[#B22830] hover:bg-[#8e1f25] text-white font-bold py-2.5 rounded-lg transition shadow-md flex justify-center items-center gap-2">
            Vào Hệ Thống
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có quyền truy cập?{' '}
            <Link to="/register" className="text-[#B22830] font-bold hover:underline">
              Đăng ký tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;