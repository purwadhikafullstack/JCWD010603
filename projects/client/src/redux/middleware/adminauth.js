import { axiosInstance } from "../../config/config";
import user_types from "../auth/types";

export function adminLogin(values) {
  return async function (dispatch) {
    try {
      const res = await axiosInstance.post("/admin/adminlogin", values);
      console.log(res)

      const adminData = JSON.stringify(res.data.result);
      console.log(JSON.stringify(adminData))

      if (adminData) {
        dispatch({
          type: user_types.ADMIN_LOGIN,
          payload: res.data.result,
        });
        localStorage.setItem("data", adminData);
        return { status: true, data: res.data.result };
      }
      return { status: false, data: {} };
    } catch (err) {
      console.log(err);
      return { status: false, data: {} };
    }
  };
}