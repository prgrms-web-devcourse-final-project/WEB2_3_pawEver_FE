import authAxiosInstance from "./authAxiosInstance";

export const getPost = async (postId: string) => {
  try {
    const { data } = await authAxiosInstance.get(
      `/api/community/posts/${postId}`
    );
    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(err);
  }
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await authAxiosInstance.post(
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
    console.error(err);
  }
};

export const updatePost = async (postId: string, formData: FormData) => {
  try {
    const response = await authAxiosInstance.patch(
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
    console.error(err);
  }
};

export const deletePost = async (postId: string) => {
  try {
    await authAxiosInstance.delete(`/api/community/posts/${postId}`);
  } catch (err) {
    console.error(err);
  }
};
