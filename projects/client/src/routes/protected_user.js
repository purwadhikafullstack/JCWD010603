import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPageUser({
  children,
  userLogin = false,
  guestOnly = false,
  adminLogin = false,
  adminGuest = false,
  superAdmin = false,
}) {
  let navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth);
  const adminSelector = useSelector((state) => state.adminAuth);

  useEffect(() => {
    console.log("adminSelector:", adminSelector);
    console.log("adminLogin:", adminLogin);
    if (userLogin && !userSelector.id) {
      return navigate("/login", { replace: true });
    }

    if (userSelector.id && userSelector.isVerivy) {
      return navigate("/userpage");
    }

    if (userSelector.id && !userSelector.isVerify) {
      return navigate("/");
    }
  }, []);
  return children;
}

export default ProtectedPageUser;
