import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";
import AdminLoading from "../components/adminLoading";

const AdminAuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchData = async () => {
      const data = localStorage.getItem("data");

      if (data){
        dispatch({
          type: user_types.ADMIN_LOGIN,
          payload: JSON.parse(data),
        });
      }
          setIsLoading(false);
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    return isLoading ? <AdminLoading /> : children;
  };
  
  export default AdminAuthProvider;