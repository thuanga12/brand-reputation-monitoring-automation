import axiosClient from "./axios";

export const getDashboardStatistics = async (params = {}) => {
  const res = await axiosClient.get("/statistics", { params });
  return res.data;
};