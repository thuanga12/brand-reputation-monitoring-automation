import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Trash2, Search, Edit3, X, Save, ShieldAlert, User as UserIcon } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null); // State lưu user đang được sửa
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Hàm xử lý cập nhật thông tin từ Modal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/users/${editingUser._id}`, 
        {
          username: editingUser.username,
          role: editingUser.role,
          password: editingUser.password // Nếu để trống backend sẽ không đổi pass
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã cập nhật thông tin nhân viên!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này không thể hoàn tác.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Đã xóa người dùng");
        fetchUsers();
      } catch (err) { toast.error("Lỗi khi xóa"); }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h2>
          <p className="text-sm text-slate-500">Quản lý nhân viên và phân quyền hệ thống Highlands</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Tìm tên hoặc email..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nhân viên</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quyền hạn</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-[#B22830] rounded-full flex items-center justify-center font-bold border border-red-100">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="" />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                    user.role === 'manager' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingUser({...user, password: ''})} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Sửa thông tin"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa tài khoản"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL CHỈNH SỬA --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldAlert className="text-[#B22830]" size={20} />
                <span>Chỉnh sửa tài khoản</span>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Tên hiển thị</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-red-100 border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Vai trò hệ thống</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-red-100 border-slate-200 bg-white"
                >
                  <option value="user">User (Nhân viên)</option>
                  <option value="manager">Manager (Quản lý)</option>
                  <option value="admin">Admin (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Đặt lại mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Để trống nếu không muốn đổi"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-red-100 border-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#B22830] text-white rounded-xl font-bold hover:bg-[#8e1f25] shadow-lg shadow-red-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : <><Save size={18} /> Lưu thay đổi</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;