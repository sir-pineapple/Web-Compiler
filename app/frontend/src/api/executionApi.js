import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const executeCode = async (language, code, stdin = "") => {
    const response = await axios.post(`${API_URL}/execute`,
        {
            language,
            code,
            stdin
        }
    );
    return response.data;
};

export const getExecution = async (executionId) => {
    const response = await axios.get(`${API_URL}/execution/${executionId}`);
    return response.data;
};