const { Router } = require('express');
const compileRouter = Router();

const fs = require('fs');
const path = require('path');

const multer = require('multer')
const upload = multer({ dest: "../codes/" });

const Docker = require('dockerode');

compileRouter.post("/c", upload.single("file"), async (req, res) => {
    const docker = new Docker();
    if (!req.file) {
        return res.status(403).json({message: "no file received"});
    }
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    docker
    .run("gcc:latest", [
        "sh",
        "-c",
        `gcc -o /app/code /app/${fileName} && /app/code || (echo 'Compilation failed' && exit 1)`
    ], process.stdout, {
        Binds: [
            `${path.resolve(filePath)}:/app/${fileName}`
        ]
    })
    .then(() => {
        res.status(200).json({message: "code executed successfully"});
    })
    .catch((err) => {
        console.error(err);
        res.status(503).json({message: "error during execution"});
    })
    .finally(() => {
        fs.unlinkSync(filePath);
    })
})

compileRouter.post("/cpp", upload.single("file"), async (req, res) => {
    const docker = new Docker();
    if (!req.file) {
        return res.status(403).json({message: "no file received"});
    }
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    docker
    .run("gcc:latest", [
        "sh",
        "-c",
        `g++ -o /app/code /app/${fileName} && /app/code || (echo 'Compilation failed' && exit 1)`
    ], process.stdout, {
        Binds: [
            `${path.resolve(filePath)}:/app/${fileName}`
        ]
    })
    .then(() => {
        res.status(200).json({message: "code executed successfully"});
    })
    .catch((err) => {
        console.error(err);
        res.status(503).json({message: "error during execution"});
    })
    .finally(() => {
        fs.unlinkSync(filePath);
    })
})

compileRouter.post("/java", upload.single("file"), async (req, res) => {
    const docker = new Docker();
    if (!req.file) {
        return res.status(403).json({message: "no file received"});
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileNameWithoutExt = path.parse(fileName).name;

    docker
    .run("openjdk:latest", [
        "sh",
        "-c",
        `javac /app/${fileName} && java -cp /app ${fileNameWithoutExt} || (echo 'Compilation or execution failed' && exit 1)`
    ], process.stdout, {
        Binds: [
            `${path.resolve(filePath)}:/app/${fileName}`
        ]
    })
    .then(() => {
        res.status(200).json({message: "Java code executed successfully"});
    })
    .catch((err) => {
        console.error(err);
        res.status(503).json({message: "Error during execution"});
    })
    .finally(() => {
        fs.unlinkSync(filePath);
    });
});

compileRouter.post("/python", upload.single("file"), async (req, res) => {
    const docker = new Docker();
    if (!req.file) {
        return res.status(403).json({ message: "no file received" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    docker
        .run("python:latest", [
            "sh",
            "-c",
            `python3 /app/${fileName} || (echo 'Execution failed' && exit 1)`
        ], process.stdout, {
            Binds: [
                `${path.resolve(filePath)}:/app/${fileName}`
            ]
        })
        .then(() => {
            res.status(200).json({ message: "Python code executed successfully" });
        })
        .catch((err) => {
            console.error(err);
            res.status(503).json({ message: "Error during execution" });
        })
        .finally(() => {
            fs.unlinkSync(filePath);
        });
});


module.exports = {
    compileRouter: compileRouter
}