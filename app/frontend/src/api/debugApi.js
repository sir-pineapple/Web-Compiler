import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/debug`;

export const debugCode = async (payload) => {
    const response = await axios.post(`${API_URL}`, payload);
    return response.data;
}