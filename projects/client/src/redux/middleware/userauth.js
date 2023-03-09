import { axiosInstance } from "../../config/config";
import user_types from "../auth/types";

export function userLogin(values) {
  return async function (dispatch) {
    try {
      const res = await axiosInstance.post("/user/v1", values);
      console.log(res);

      const userData = JSON.stringify(res.data.result);
      console.log(JSON.stringify(userData));

      if (userData) {
        dispatch({
          type: user_types.USER_LOGIN,
          payload: res.data.result,
        });
        localStorage.setItem("data", userData);
        return { status: true, data: res.data.result };
      }
      return { status: false, data: {} };
    } catch (err) {
      console.log(err);
      return { status: false, data: {} };
    }
  };
}
