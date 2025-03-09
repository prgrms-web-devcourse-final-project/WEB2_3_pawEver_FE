import { axiosInstance } from "./axios";

export const getPost = async (postId: string) => {
  try {
    const { data } = await axiosInstance.get(`/api/community/posts/${postId}`);

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "/api/community/posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = async (postId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/community/posts/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId: string) => {
  try {
    await axiosInstance.delete(`/api/community/posts/${postId}`);
  } catch (err) {
    console.log(err);
  }
};
