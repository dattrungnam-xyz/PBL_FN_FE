import axios from "axios";

const BASE_URL = "https://open.oapi.vn/location";

export const getProvinces = async () => {
  const response = await axios.get(`${BASE_URL}/provinces`, {
    params: {
      page: 0,
      size: 1000,
    },
  });
  return response.data.data;
};

export const getDistricts = async (provinceId: string) => {
  const response = await axios.get(`${BASE_URL}/districts/${provinceId}`, {
    params: {
      page: 0,
      size: 1000,
    },
  });
  return response.data.data;
};

export const getWards = async (districtId: string) => {
  const response = await axios.get(`${BASE_URL}/wards/${districtId}`, {
    params: {
      page: 0,
      size: 1000,
    },
  });
  return response.data.data;
};
