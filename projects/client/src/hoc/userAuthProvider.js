import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";
import { axiosInstance, AxiosInstance } from "../config/config";
import { useEffect, useState } from "react";
import Loading from "../components/loading";

const UserAuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = localStorage.getItem("dataUser");
    if (data) {
      dispatch({
        type: user_types.USER_LOGIN,
        payload: JSON.parse(data),
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? <Loading /> : children;
};
export default UserAuthProvider;
