const { Router } = require('express');
const langRouter = Router();

const { runCode } = require("./compile");

const multer = require('multer')
const upload = multer({ dest: "../codes/" });

langRouter.post("/c", upload.single("file"), async (req, res) => {
    const { statusCode, message } = await runCode("C", req.file);
    res.status(statusCode).json({message: message});
})

langRouter.post("/cpp", upload.single("file"), async (req, res) => {
    const { statusCode, message } = await runCode("C++", req.file);
    res.status(statusCode).json({message: message});
})

langRouter.post("/java", upload.single("file"), async (req, res) => {
    const { statusCode, message } = await runCode("Java", req.file);
    res.status(statusCode).json({message: message});
})

langRouter.post("/python", upload.single("file"), async (req, res) => {
    const { statusCode, message } = await runCode("Python", req.file);
    res.status(statusCode).json({message: message});
})


module.exports = {
    langRouter: langRouter
}