import axiosClient from "./axios";

export const getHighlandReviews = async (params = {}) => {
  const res = await axiosClient.get("/reviews-highland", { params });
  return res.data;
};