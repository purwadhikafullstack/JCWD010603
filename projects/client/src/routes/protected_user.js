import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPageUser({ children, userLogin = false, guestOnly = false }) {
  let navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    if (userLogin && !userSelector.id) {
      return navigate("/userlogin", { replace: true });
    }
  }, []);
  return children;
}

export default ProtectedPageUser;
