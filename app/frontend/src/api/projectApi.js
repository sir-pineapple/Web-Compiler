const API_URL = `${import.meta.env.VITE_API_URL}/projects`;

export const getProjects = async () => {
    const response = await fetch(`${API_URL}/`, { credentials: "include" });
    return response.json();
}

export const getProject = async (projectId) => {
    const response = await fetch(`${API_URL}/${projectId}`, { credentials: "include" });
    return response.json();
};

export const createProject = async (project) => {
    const response = await fetch(`${API_URL}/`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    return response.json();
}

export const updateProject = async (projectId, project) => {
    const response = await fetch(`${API_URL}/${projectId}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    return response.json();
}

export const deleteProject = async (projectId) => {
    const response = await fetch(`${API_URL}/${projectId}`, { method: "DELETE", credentials: "include" });
    return response.json();
};