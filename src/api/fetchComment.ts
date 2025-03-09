import { axiosInstance } from "./axios";

export const getComment = async (postId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/community/${postId}/replies`
    );

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/community/${postId}/replies`,
      { content }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateComment = async (
  postId: string,
  replyId: number,
  content: string
) => {
  try {
    const response = await axiosInstance.put(
      `/api/community/${postId}/replies/${replyId}`,
      { content }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteComment = async (postId: string, replyId: number) => {
  try {
    await axiosInstance.delete(`/api/community/${postId}/replies/${replyId}`);
  } catch (err) {
    console.log(err);
  }
};
