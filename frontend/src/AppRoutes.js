import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Users from "./pages/users";
import AdminRoute from "./routes/AdminRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
    path="/users"
    element={
        <AdminRoute>
            <Users />
        </AdminRoute>
    }
/>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}


export default AppRoutes;