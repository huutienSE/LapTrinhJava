import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = () => {

    const { currentUser, isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (currentUser?.role !== "ADMIN") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default AdminRoute;