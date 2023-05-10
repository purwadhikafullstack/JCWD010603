import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";
import { axiosInstance, AxiosInstance } from "../config/config";
import { useEffect, useState } from "react";
import Loading from "../components/loading";

const UserAuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    await axiosInstance
      .get("/api/user/keeplogin", { headers: { Authorization: token } })
      .then((res) => {
        dispatch({
          type: user_types.USER_LOGIN,
          payload: res.data.result,
        });
      })

      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? <Loading /> : children;
};
export default UserAuthProvider;
