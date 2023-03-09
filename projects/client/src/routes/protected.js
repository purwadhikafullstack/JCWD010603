import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({
    children,
    needLogin = false,
    guestOnly = false,
    authRoles = ["User", "Admin"],
    isSuperAdmin = false,
}) {
    let navigate = useNavigate();
    const userSelector = useSelector((state) => state.auth);

    useEffect(() => {
        if (needLogin && !userSelector?.id) {
            return navigate("/", { replace: true });
        }

        if (guestOnly && userSelector.id) {
            return navigate("/cashier", { replace: true });
        }

        if (authRoles === "Cashier"){
            return navigate ("/cahsierpage", { replace: true })
        }

        if (authRoles === "Admin"){
            return navigate ("/admin", { replace: true })
        }

        if (isSuperAdmin === false){
            return navigate ("/admin", {replace: true})
        }

        if (isSuperAdmin === true){
            return navigate ("/admin", {replace: true})
        }

    }, []);
    return children;
}