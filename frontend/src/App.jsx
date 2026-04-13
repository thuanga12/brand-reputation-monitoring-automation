import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalysisPage from './pages/Dashboard/AnalysisPage';
// Giả sử bạn đã tạo các file trong folder pages

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Menu điều hướng đơn giản */}
        <nav className="bg-white shadow-sm p-4 flex gap-6 border-b">
          <Link to="/" className="font-bold text-red-700">Highlands Admin</Link>
          <Link to="/analysis" className="text-gray-600 hover:text-red-700">Phân tích đối thủ</Link>
          <Link to="/interaction" className="text-gray-600 hover:text-red-700">Phản hồi khách</Link>
        </nav>

        <main className="container mx-auto">
          <Routes>
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/" element={<div className="p-10">Chào mừng bạn đến với hệ thống giám sát thương hiệu!</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;