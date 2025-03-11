import { axiosInstance } from "./axios";
import authAxiosInstance from "./authAxiosInstance";

export const getShelters = async (cityName = "", districtName = "") => {
  try {
    const { data } = await authAxiosInstance.get(
      `/api/animals/search/shelters`,
      {
        params: { cityName, districtName },
      }
    );

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getShelterReservation = async () => {
  try {
    const { data } = await axiosInstance.get("/api/reservation/shelters");

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};
