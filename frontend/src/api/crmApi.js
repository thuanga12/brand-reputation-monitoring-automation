import axios from './axios'; // Sử dụng instance axios chung của nhóm

export const getCRMStrategy = () => axios.get('/api/crm/strategy');
export const approveReply = (id, final_reply) => axios.patch(`/api/crm/approve-reply/${id}`, { final_reply });