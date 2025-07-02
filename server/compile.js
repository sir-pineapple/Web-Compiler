const { Router } = require('express');
const compileRouter = Router();

compileRouter.post("/c", (req, res) => {
})

compileRouter.post("/cpp", (req, res) => {
})

compileRouter.post("/java", (req, res) => {
})

compileRouter.post("/python", (req, res) => {
})

module.exports = {
    compileRouter: compileRouter
}