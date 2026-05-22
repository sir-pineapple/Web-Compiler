import axios from "axios";

const API = "http://localhost:5000";

export const executeCode = async (language, code, stdin = "") => {
    const response = await axios.post(`${API}/execute`,
        {
            language,
            code,
            stdin
        }
    );
    return response.data;
};

export const getExecution = async (executionId) => {
    const response = await axios.get(`${API}/execution/${executionId}`);
    return response.data;
};