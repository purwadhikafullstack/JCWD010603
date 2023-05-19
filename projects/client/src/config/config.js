import axios from "axios";
export const API_URL = "https://jcwd010603.purwadhikabootcamp.com";
// export const API_URL = "http://localhost:8000";
//menciptakan base api url
export const axiosInstance = axios.create({
  baseURL: API_URL,
});
export const beautyScroll = {
  "::-webkit-scrollbar": {
    height: "0.3em",
    width: "0.3em",
    backgroundColor: "none",
    borderRadius: "10px",
  },
  "::-webkit-scrollbar-thumb": {
    // backgroundColor: '#181D31',
    backgroundColor: "gray.200",
    borderRadius: "10px",
  },
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555555",
    borderRadius: "10px",
  },
};
