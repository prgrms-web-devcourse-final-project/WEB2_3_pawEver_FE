import { axiosInstance } from "./axios";

export const fetchCommunity = async () => {
  try {
    const { data } = await axiosInstance.get("/api/community/posts");

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};
