const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { createProject, getProjects, getProject, updateProject, deleteProject } = require("../controllers/project.controller");

router.use(auth);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;