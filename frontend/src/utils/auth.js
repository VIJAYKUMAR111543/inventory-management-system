export const TOKEN_KEY = "inventory_token";

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};