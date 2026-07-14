import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../utils/auth";
import { getCurrentUser } from "../services/authService";

function AdminRoute({ children }) {

    if (!isAuthenticated()) {

        return <Navigate to="/login" replace />;

    }

    const user = getCurrentUser();

    if (!user || user.role !== "ADMIN") {

        return <Navigate to="/" replace />;

    }

    return children;

}

export default AdminRoute;