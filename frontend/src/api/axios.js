import axios from 'axios';

const instance = axios.create({
  // Port 5000 là nơi Backend của bạn đang chạy
  baseURL: 'http://localhost:5000/api', 
  timeout: 5000,
});

export default instance;