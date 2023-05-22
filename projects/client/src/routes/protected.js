import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage({
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
  console.log(`admin = ${adminSelector.id}`)
  useEffect(() => {
    if (userLogin && !userSelector.id) {
      return navigate("/login", { replace: true });
    }
    if (adminLogin && !adminSelector.id) {
      return navigate("/admin-login", { replace: true });
    }
    if (!adminLogin && adminSelector.id) {
      return navigate("/category", { replace: true });
    }
    if (!adminSelector.isSuperAdmin && superAdmin) {
      return navigate("/dashboard", { replace: true });
    }
  }, []);
  return children;
}

export default ProtectedPage;
