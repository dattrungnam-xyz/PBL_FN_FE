import axios from "../axios";

export const getChat = async (message: string) => {
  const response = await axios.post("/chat", { message });
  return response.data;
};

