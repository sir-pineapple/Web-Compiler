const API_URL = "http://localhost:5000/auth";

export const getMe = async () => {
    const response = await fetch(`${API_URL}/me`, { credentials: "include" });
    if (!response.ok) {
        return null;
    }
    return response.json();
}

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });
    return response;
};

export const register = async (email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });
    return response;
};

export const logout = async () => {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });
};