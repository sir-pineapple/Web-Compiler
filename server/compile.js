const { Router } = require('express');
const compileRouter = Router();

compileRouter.post("/c", (req, res) => {
    const code = req.body.code;
    if (!code) {
        res.json({output: "Please enter code"});
        return;
    }
})

compileRouter.post("/cpp", (req, res) => {
    const code = req.body.code;
    if (!code) {
        res.json({output: "Please enter code"});
        return;
    }
})

compileRouter.post("/java", (req, res) => {
    const code = req.body.code;
    if (!code) {
        res.json({output: "Please enter code"});
        return;
    }
})

compileRouter.post("/python", (req, res) => {
    const code = req.body.code;
    if (!code) {
        res.json({output: "Please enter code"});
        return;
    }
})

module.exports = {
    compileRouter: compileRouter
}