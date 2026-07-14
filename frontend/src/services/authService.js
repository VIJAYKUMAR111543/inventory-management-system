import axios from "axios";
import api from "./api";
const TOKEN_KEY = "inventory_token";

// =====================================
// Login
// =====================================

export const login = async (email, password) => {

    const params = new URLSearchParams();

    params.append("username", email);
    params.append("password", password);

    const response = await axios.post(
        "/auth/login",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    localStorage.setItem(
    TOKEN_KEY,
    response.data.access_token
);

// Load current user immediately after login
const me = await api.get("/auth/me");

localStorage.setItem(
    "inventory_user",
    JSON.stringify(me.data)
);

return response.data;

};


// =====================================
// Logout
// =====================================

export const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem("inventory_user");

};


// =====================================
// Get Token
// =====================================

export const getToken = () => {

    return localStorage.getItem(TOKEN_KEY);

};


// =====================================
// Is Logged In
// =====================================

export const isLoggedIn = () => {

    return !!getToken();

};


// =====================================
// Get Current User
// =====================================

export const getCurrentUser = () => {

    const user = localStorage.getItem("inventory_user");

    if (!user) {

        return null;

    }

    return JSON.parse(user);

};


// =====================================
// Axios Authorization
// =====================================

axios.interceptors.request.use(

    (config) => {

        const token = getToken();

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);