import axios from "./axios";

export const getReviewsHighland = async () => {
  const res = await axios.get("/reviews-highland");
  return res.data;
};