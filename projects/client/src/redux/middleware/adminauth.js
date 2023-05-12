import { axiosInstance } from "../../config/config";
import user_types from "../auth/types";

export function adminLogin(values) {
  return async function (dispatch) {
    try {
      const res = await axiosInstance.post("/api/admin/adminlogin", values);
      console.log("this is res =", res);

      const adminData = JSON.stringify(res.data.result);
      const adminToken = JSON.stringify(res.data.token);

      if (adminData) {
        dispatch({
          type: user_types.ADMIN_LOGIN,
          payload: res.data.result,
        });

        localStorage.setItem("data", adminData);
        localStorage.setItem("admintoken", adminToken);
        return { status: true, data: res.data.result, token: res.data.token };
      }

      return { status: false, data: {} };
    } catch (err) {
      console.log(err.response.data);
      return { status: false, data: {}, message: err.response.data };
    }
  };
}
