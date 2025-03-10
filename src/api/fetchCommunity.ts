import { axiosInstance } from "./axios";

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/api/community/posts");

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getfilteredPosts = async (q: string) => {
  try {
    const { data } = await axiosInstance.get(`/api/community/posts/search`, {
      params: { q },
    });

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};
