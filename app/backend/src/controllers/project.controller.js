const projectService = require("../services/project.service");

const createProject = async (req, res) => {
    const { name, language, code, stdin } = req.body;
    const result = await projectService.createProject(req.userId, name, language, code, stdin);
    res.status(201).json(result);
};

const getProjects = async (req, res) => {
    const project = await projectService.getProjects(req.userId);
    res.json(project);
};

const getProject = async (req, res) => {
    const project = await projectService.getProjectById(req.userId, req.params.id);
    if (!project) {
        return res.status(404).json({message: "Project not found"});
    }
    res.json(project);
};

const updateProject = async (req, res) => {
    const { name, language, code, stdin } = req.body;
    const updated = await projectService.updateProject(req.userId, req.params.id, name, language, code, stdin);
    res.json(updated);
};

const deleteProject = async (req, res) => {
    await projectService.deleteProject(req.userId, req.params.id);
    res.json({message: "Project deleted"});
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };